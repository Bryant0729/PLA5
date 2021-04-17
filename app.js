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

var jwt=require('jsonwebtoken');
//https://jsao.io/2015/06/authentication-with-node-js-jwts-and-oracle-database/

const app = express();
const server=require('http').createServer(app);
const io = require('socket.io')(server);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use( express.static( "public" ) );

app.set('views', __dirname+'/views');

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  secret: 'Qu4^}-P]ffsS*UNq>gKyD~G}VHH7%',
  resave: false,
  saveUninitialized: true,
}))

app.use('/', mainframe);

const aUsers= new Set();

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
