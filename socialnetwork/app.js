const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Users = require('./routes/users');
const Publications = require('./routes/publications');

//data base connection
mongoose.connect('mongodb://localhost:27017/socialnetwork');
mongoose.connection.on('connected',()=>{
    console.log('you are connected to mongodb database');
});
mongoose.connection.on('err',(err)=>{
    console.log('connection error : '+err);
});
//app init
var app = express();

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());

//set the public folder
app.use(express.static(path.join(__dirname,'public')));

//users route
app.use('/users', Users);
app.use('/publications', Publications);
//start app
app.listen(3000,()=>{
    console.log('server is running in port 3000...');
});