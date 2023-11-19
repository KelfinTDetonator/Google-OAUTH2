require('dotenv').config()
const express = require('express'),
      app     = express(),
      path = require('path'),
      logger = require('morgan'),
      router = require('./src/routes/index'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      createError = require('http-errors'),
      { createServer } = require('http'),
      { Server } = require("socket.io"),
      PORT = process.env.PORT,
      Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0
})

const server = createServer(app);
const io = new Server(server);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(logger('combined'))      
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));     
app.use(bodyParser.json())

app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs")   

app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.use(router)

//socket.io config
io.on('connection', (socket)=>{ 
    console.log(`A user connected`); 
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
});
io.on('connection', (socket) => {
    socket.on('sendNotif', (msg) => {
      console.log(msg);
      io.emit('newNotif', msg); 
    });
});
app.use(Sentry.Handlers.errorHandler());
app.use(function(req, res, next) {
    next(createError(404, "Not found"));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;   
    res.locals.error = req.app.get('env') === 'development' ? err : {};   
    res.status(err.status || 500);
    res.render('error');
    console.error(err.stack)
});

server.listen(PORT, ()=>{
    console.log(`Server is listening at PORT ${PORT}`);
})