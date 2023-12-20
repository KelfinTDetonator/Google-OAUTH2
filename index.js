require('dotenv').config()
const express = require('express'),
      app     = express(),
      path = require('path'),
      morgan = require('morgan'),
      router = require('./src/routes/index'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      createError = require('http-errors'),
      PORT = process.env.PORT || 8080;
      
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));     
app.use(bodyParser.json());

app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs")   

app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.use(router)

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

app.listen(PORT, ()=>{
    console.log(`Server is listening at PORT ${PORT}`);
})