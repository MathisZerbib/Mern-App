//Définition des modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

//On définit notre objet express nommé app
const app = express();

//Body Parser
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//On définit la route Hello
app.get('/hello',function(req,res){
    res.json("Hello World")
})

//Définition et mise en place du port d'écoute
var port = 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));