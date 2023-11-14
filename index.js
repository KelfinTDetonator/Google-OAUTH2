require('dotenv').config()
const express = require('express'),
      app     = express(),
      path = require('path'),
      PORT = process.env.PORT,
      logger = require('morgan'),
      createError = require('http-errors');

app.use(express.urlencoded({ extended: false }));     
app.use(express.json())

app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs")   

app.use(logger('dev'));

app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.use(function(req, res, next) {
    next(createError(404, "Not found"));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;   
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(res.locals);    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
    console.error(err.stack)
    next();
});

app.listen(PORT, ()=>{
    console.log(`Server is listening at PORT ${PORT}`);
})