var express    = require('express');
var mysql      = require('mysql');
var dbconfig   = require('./config/database.js');
var connection = mysql.createConnection(dbconfig);

var app = express();
var port = 4500;

app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/persons', function(req, res){

  connection.query('SELECT * from Persons', function(err, rows) {
    if(err) throw err;

    console.log('result ', rows);
    res.send(rows);
  });
});

app.listen(port, function(req,res){
    console.log("express server on port", port)
  });