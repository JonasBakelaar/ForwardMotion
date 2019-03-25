'use strict'

//Database stuff
const mysql = require('mysql');
let connection = null;

// C library API
const ffi = require('ffi');

// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const fileUpload = require('express-fileupload');
const reqP = require('request-promise');

app.use(fileUpload());

// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

//Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
  if(!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadFile = req.files.uploadFile;

  // Use the mv() method to place the file somewhere on your server
  uploadFile.mv('uploads/' + uploadFile.name, function(err) {
    if(err) {
      return res.status(500).send(err);
    }

    res.redirect('/');
  });
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
  fs.stat('uploads/' + req.params.name, function(err, stat) {
    console.log(err);
    if(err == null) {
      res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
    } else {
      res.send('');
    }
  });
});

//******************** Your code goes here ********************
app.use(express.static(require('path').join(__dirname,'public')));

var ontLinks = ['https://files.ontario.ca/en-2018-pssd-compendium.json'/*,
				'https://files.ontario.ca/en-2016-pssd-compendium-20171128-utf8.json',
				'https://api.ontario.ca/api/data/31107?count=0&download=1',
				'https://api.ontario.ca/api/data/25354?count=0&download=1',
				'https://api.ontario.ca/api/data/38240?count=0&download=1',
				'https://api.ontario.ca/api/data/38574?count=0&download=1',
				'https://api.ontario.ca/api/data/46315?count=0&download=1',
				'https://api.ontario.ca/api/data/46170?count=0&download=1'*/
				];
var dataPoints = [];//Array of ontario data use dataPoints.[attribute]

/*
 * Generates the data set from the above list of links and stores into dataPoints
 * Any errors when retreiving the data are not re-pulled
 * */
app.post('/refreshOntarioData', function(req, res) {
	var completedLinks = 0;
	var toDoLinks = ontLinks.length;
	for (var i = 0; i < ontLinks.length;i++) {
		reqP(ontLinks[i])
			.then(function(html) {
				dataPoints = dataPoints.concat(JSON.parse(html));
        console.log(dataPoints[1]);
				completedLinks++;
			})
			.catch(function(err){
				console.log("error retrieving data for a link");
				toDoLinks--;
			})
			.finally(function () {
				if (completedLinks == toDoLinks) {//Once all links have completed this will be called
  				console.log("Link Complete");
					res.sendStatus(200);
				}
			});
	}
});

app.get('/getTableData', function(req, res) {
	var numRows = Number(req.query['rows']);
	var startRow = Number(req.query['startIndex']);
	var tableData = dataPoints.slice(startRow, startRow + numRows);
	res.send(tableData);
});

/** Database stuff **/


app.get('/connect', function(req , res){
    console.log('Connect to the database!');
    let failure = false;
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'password',
        database : 'ForwardMotion'
    });
    let fileTableExists = true;
    let individualTableExists = true;
    connection.connect(function(err){
	    if(err){
			console.log("Something went wrong");
			failure = true;
			res.send("failure");
		    //Call error
		}

    });
});

app.get('/insertRow', function(req , res){
    console.log('Inserting data!');
    let lastName = req.query.lastName;
    let firstName = req.query.firstName;
    let salary = req.query.salary;
    let employer = req.query.employer;
    let jobTitle = req.query.jobTitle;
    let year = req.query.year;
    let failure = false;
    let fileTableExists = true;
    let individualTableExists = true;

    connection.query("insert into test2 (lastName, firstName, salary, employer, jobTitle, year) values ('" + lastName + "', '"+ firstName +"', '"+ salary +"', '"+ employer +"', '"+ jobTitle +"', '"+ year +"')", function (err, rows, fields) {
        if (err) console.log(err);
        failure = true;
    });
    console.log("created successfully");
    if(failure === true){
		console.log('sending failure');
		res.send("failure");
	} else {
    	console.log("sending success");
    	res.send("success");
	}
});


app.get('/searchDatabase', function(req , res){
    console.log('Inserting data!');
    let employer = req.query.employer;
    let failure = false;
    let fileTableExists = true;
    let individualTableExists = true;

    connection.query("SELECT * FROM test2 WHERE employer LIKE '%"+ employer +"%' LIMIT 5", function (err, rows, fields) {
        if (err){
          console.log(err);
          failure = true;
        }

        console.log("searched successfully");
        if(failure === true){
    	  	console.log('sending failure');
    	  	res.send("failure");
      	} else {
        	console.log("sending success");
          console.log(rows);
        	res.send(rows);
    	  }
    });
});


app.listen(portNum);
console.log('Running app at localhost: ' + portNum);
