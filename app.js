var createError = require('http-errors');
const express = require('express');
const fs = require('fs');
var path = require('path');
var session = require('express-session');
var cooksess= require('client-sessions');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser= require("body-parser");
const uuid = require('uuid/v4');

var mainframe = require(__dirname + '/routes/mainframe.js');
global.rootDir = __dirname;

const app = express();
const server=require('http').createServer(app);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use( express.static( "public" ) );

app.set('views', __dirname+'/views');

app.use('/', mainframe);

const Facility = class{
	constructor(name,fid, floors){
		this.name=name;
		this.fid=fid;
		this.floors=floors;
	}
}

const port=process.env.PORT || 3000;
const ip='localhost'
server.listen(port,ip,function(){
console.log(`listening on port ${port}...`);
});
module.exports = app;
