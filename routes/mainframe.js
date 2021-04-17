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

const getDir= source=>
			readdirSync(source,{withFileTypes: true})
			.filter(dirent=>dirent.isDirectory())
			.map(dirent => dirent.name)

router.get('/',async(req,res,next)=>{
    try{
		var test= getDir(rootDir + "/public/facilities/")
		
		console.log(test)
		console.log(req.session.userstat);
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

			console.log(assets)
			let tempassets=[]
			assets.forEach(x=>x.facility===p ? tempassets.push(x):x);
			console.log(tempassets)
			res.render(path.join('./facility/blueprint'),{assets:tempassets,title:p});	
		}
		res.render(path.join('./facility/facility'),{title:p});

    }catch (e){
        next(e);
    }
    
});

router.post('/selectFacility',async(req, res,next)=> {
	try{
		readinAssets(req.body.facilities, function(data){
			});
	res.redirect('/facilities/'+req.body.facilities);		
	}catch (e){
		next(e);
	}
});

router.post('*/addAsset',async(req, res,next)=> {
	try{
		console.log(req.body.dnsname+","+req.body.elX+","+req.body.elY);
		let asset= new Asset(req.body.dnsname,req.body.elX,req.body.elY,req.body.facility);
		assets.add(asset);
		res.redirect('/facilities/'+req.body.facility);		
	}catch (e){
		next(e);
	}
});

function readinAssets(x,cb){
	fs.readFile(rootDir+'/public/facilities/'+x+'/assets.json', (err, data) => {  
                   if (err) throw err;
                 let fullinfo = JSON.parse(data);
                  console.log(fullinfo);
					for (var i = 0; i < fullinfo.length; i++){
						let asset= new Asset(fullinfo[i].name,fullinfo[i].x,fullinfo[i].y,fullinfo[i].facility)
						if(assets.has(asset.name)){
							
						}else{
							assets.add(asset)
						}
						
					}
					cb(fullinfo);
          });
}

module.exports = router;
