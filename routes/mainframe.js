var express = require('express');
var path = require('path');
const fs = require('fs');
const {readdirSync} = require('fs')

var router = express.Router();

const Asset = class{
	constructor(name,locX,locY,facility){
		this.name=name;
		this.x=locX;
		this.y=locY;
		this.facility=facility;
	}
}

var assets= new Set()
readinAssets(function(data){});

const getDir= source=>
			readdirSync(source,{withFileTypes: true})
			.filter(dirent=>dirent.isDirectory())
			.map(dirent => dirent.name)

router.get('/',async(req,res,next)=>{
    try{
		var test= getDir(rootDir + "/public/facilities/")
		
		console.log(test)
		res.render(path.join('./homepage'),{numFac:test.length, facilities:test});

    }catch (e){
        next(e);
    }
    
});

router.get('/facilities/*',async(req,res,next)=>{
    try{
		var p=(req.url).split('/')[2];
		if( (req.url).split('/')[3]== "report"){
			res.render(path.join('./facility/facility'),{title:p});	
		}
		if( (req.url).split('/')[3]== "blueprint"){
			let tempassets=[]
			assets.forEach(x=>x.facility===p ? tempassets.push(x):x);
			res.render(path.join('./facility/blueprint'),{assets:tempassets,title:p});	
		}
		res.render(path.join('./facility/facility'),{ title:p});

    }catch (e){
        next(e);
    }
    
});

router.get('/assets/*',async(req,res,next)=>{
    try{
		
		res.render(path.join('./asset'),{assetname:(req.url).split('/')[2]});

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

router.post('*/addAsset',async(req, res,next)=> {
	try{
		console.log(req.url);
		console.log(req.body.dnsname+","+req.body.elX+","+req.body.elY);
		let asset= new Asset(req.body.dnsname,req.body.elX,req.body.elY,req.body.facility);
		let found = undefined;
		
		for(const e of assets){
				if(e.name===req.body.dnsname){
					found=e;
					assets.delete(found);
					break;
				}
		}
		if(found===req.body.dnsname){
			assets.add(asset);
		}else{
			assets.add(asset);
		}
		
		addinAssets(function(data){});
		
		res.redirect('/facilities/'+req.body.facility);		
	}catch (e){
		next(e);
	}
});

router.post('*/moveAsset',async(req, res,next)=> {
	try{
		console.log(req.body.dnsname+","+req.body.elX+","+req.body.elY);
		let asset= new Asset(req.body.dnsname,req.body.elX,req.body.elY,req.body.facility);
		let found = undefined;
		
		for(const e of assets){
				if(e.name===req.body.dnsname){
					found=e;
					assets.delete(found);
					break;
				}
		}
		if(found===req.body.dnsname){
			assets.add(asset);
		}else{
			assets.add(asset);
		}
		
		addinAssets(function(data){});
		
		res.redirect('/facilities/'+req.body.facility+'/blueprint');		
	}catch (e){
		next(e);
	}
});

router.post('*/deleteAsset',async(req, res,next)=> {
	try{
		var p=(req.url).split('/')[2];
		console.log(p);
		console.log(req.body.dname);
		let found = undefined;
		for(const e of assets){
				if(e.name===req.body.dname){
					found=e;
					assets.delete(found);
					break;
				}
		}
		
		addinAssets(function(data){});
		readinAssets(function(data){});
		res.redirect('/facilities/'+p+'/');		
	}catch (e){
		next(e);
	}
});


function readinAssets(cb){
	fs.readFile(rootDir+'/public/facilities/assets.json', (err, data) => {  
                   if (err) throw err;
                 let fullinfo = JSON.parse(data);
                  assets.clear();
					for (var i = 0; i < fullinfo.length; i++){
						let asset= new Asset(fullinfo[i].name,fullinfo[i].x,fullinfo[i].y,fullinfo[i].facility)
						assets.add(asset)
					}
					cb(fullinfo);
          });
}

function addinAssets(cb){
    var temp=Array.from(assets)
	json=JSON.stringify(temp)
	fs.writeFile(rootDir+'/public/facilities/assets.json',json,'utf8',cb);
	
}

module.exports = router;