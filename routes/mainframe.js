var express = require('express');
var path = require('path');
const fs = require('fs');
const {readdirSync} = require('fs')
var crypto=require('crypto');

var router = express.Router();

const getDir= source=>
			readdirSync(source,{withFileTypes: true})
			.filter(dirent=>dirent.isDirectory())
			.map(dirent => dirent.name)

router.get('/',async(req,res,next)=>{
    try{
		test= getDir(rootDir + "/public/facilities/")
		
		console.log(test)
		console.log(req.session.userstat);
		res.render(path.join('./homepage'),{numFac:1, facilities:[{name:"NavarreFSED",fid:"1"}]});

    }catch (e){
        next(e);
    }
    
});

router.get('/logout',async(req,res,next)=>{
    try{
		req.session.destroy();
		res.redirect('../');

    }catch (e){
        next(e);
    }
    
});


router.get('/facilities/*',async(req,res,next)=>{
    try{
		var p=(req.url).split('/')[2];
		
		console.log(req.session.userstat);
		if( (req.url).split('/')[3]== "report"){
			res.render(path.join('./chatroom/video'),{loggedin:req.session.userstat,username:req.session.username,title:p});	
		}
		if( (req.url).split('/')[3]== "blueprint"){
			res.render(path.join('./facility/blueprint'),{title:p});	
		}
		res.render(path.join('./chatroom/chat'),{loggedin:req.session.userstat,username:req.session.username, title:p});

    }catch (e){
        next(e);
    }
    
});
router.get('/facilities/*/report',async(req,res,next)=>{
    try{
		var p=(req.url).split('/')[2];
		if(req.session.userstat!=1){
			req.session.userstat=0;
			req.session.username="";
		}else{
			req.session.userstat=1;
		}
		console.log(req.session.userstat);
		res.render(path.join('./chatroom/video'),{loggedin:req.session.userstat,username:req.session.username,title:p});

    }catch (e){
        next(e);
    }
    
});

router.get('/videoroom/*',async(req,res,next)=>{
    try{
		var p=(req.url).split('/')[2];
		if(req.session.userstat!=1){
			req.session.userstat=0;
			req.session.username="";
		}else{
			req.session.userstat=1;
		}
		console.log(req.session.userstat);
		res.render(path.join('./chatroom/video'),{loggedin:req.session.userstat,username:req.session.username,title:p});

    }catch (e){
        next(e);
    }
    
});


router.post('/selectFacility',async(req, res,next)=> {
	try{
	res.redirect('/facilities/'+req.body.facilities);		
	}catch (e){
		next(e);
	}
});

module.exports = router;