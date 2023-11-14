require('dotenv').config()
const express = require('express'),
      app     = express(),
      PORT = process.env.PORT

app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.listen(PORT, ()=>{
    console.log(`Server is listening at PORT ${PORT}`);
})