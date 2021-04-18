var express = require('express');
var path = require('path');
const fs = require('fs');
const {readdirSync} = require('fs')

var router = express.Router();

const Asset = class{
	constructor(id,name,locX,locY,facility,state){
		this.id=id;
		this.state=state;
		this.name=name;
		this.x=locX;
		this.y=locY;
		this.facility=facility;
	}
}

const AssetInfo = class{
	constructor(id,name,updateTime,state,type,ip,freespace,uptime,idletime,currentUser,batteryP,charging,cpu,ram){
		this.id=id;
		this.name=name;
		this.updateTime=updateTime;
		this.state=state;
		this.type=type;
		this.ip=ip;
		this.freespace=freespace;
		this.uptime=uptime;
		this.idletime=idletime;
		this.currentUser=currentUser;
		this.batteryP=batteryP;
		this.charging=charging;
		this.cpu=cpu;
		this.ram=ram;
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
		gatherInfo((req.url).split('/')[2],function(){});
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
		let asset= new Asset(assets.size,req.body.dnsname,req.body.elX,req.body.elY,req.body.facility);
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
		
		gatherInfo(asset.name,function(){});
		
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
					found.x=req.body.elX;
					found.y=req.body.elY;
					assets.add(found);
					addinAssets(function(data){});
					break;
				}
		}
		
		
		
		
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
						let asset= new Asset(fullinfo[i].id,fullinfo[i].name,fullinfo[i].x,fullinfo[i].y,fullinfo[i].facility,fullinfo[i].state)
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

function gatherInfo(comp,cb){
		
		checkForFile(rootDir+"/public/assets/"+comp+".json",function()
		{
			fs.readFile(rootDir+"/public/assets/"+comp+".json", function (err,data) 
			{
		
				let found = undefined;
				for(const e of assets){
					if(e.name===comp){
						found=e;
						break;
					}
				}
		//Simulate results
				var sel=Math.floor(Math.random() * 3);
				let aiArr=[];
				let ai=undefined;
				console.log(sel);
				switch(sel){
					case 0:
						var lastreboot  = new Date(2021, 3, 14,8,30.0);
						var lastmove = new Date();
						var today=new Date();
						var uptime= Date.hoursBetween(lastreboot,today);
						var idletime= Date.hoursBetween(lastmove, today);
						ai=new AssetInfo(found.id,found.name,today,"Healthy","Desktop","X.X.X.X","50GB",uptime,idletime,"User1","NA","NA","14%","40%");
						break;
						
					case 1:
						var lastreboot  = new Date(2021, 3, 14,8,15,0);
						var lastmove = new Date();
						var today=new Date();
						var uptime= Date.hoursBetween(lastreboot,today);
						var idletime= Date.hoursBetween(lastmove, today);
						ai=new AssetInfo(found.id,found.name,today,"Unhealthy","Desktop","X.X.X.X","50GB",uptime,idletime,"User2","NA","NA","14%","40%");
						break;
					case 2:
						var lastreboot  = new Date(2021, 3, 14,8,00,0);
						var lastmove = new Date();
						var today=new Date();
						var uptime= Date.hoursBetween(lastreboot,today);
						var idletime= Date.hoursBetween(lastmove, today);
						ai=new AssetInfo(found.id,found.name,today,"Offline","Desktop","X.X.X.X","50GB",uptime,idletime,"User3","NA","NA","14%","40%");
						break;
				}
				assets.delete(found);
				found.state=ai.state;
				assets.add(found);
				
				let obj= JSON.parse(data);
				obj.table.unshift(ai);
				console.log(obj.table.length);
				if(obj.table.size>30){
					obj.table.pop();
				}
				json=JSON.stringify(obj, null, 2);
				fs.writeFile(rootDir+"/public/assets/"+found.name+".json",json,'utf8',cb);
				
				
			});
		});
		
		
		
		
		/*const { spawn } = require('child_process');
			const ps1 = spawn('cmd', ['/c', 'Powershell -ExecutionPolicy Bypass -file '+rootDir+'/resources/scripts/gatherInfo.ps1 '+comp+'']);
			bat.stdout.on('data', (data) => {
				console.log(data.toString());
			});

			bat.stderr.on('data', (data) => {
				console.log(data.toString());
			});

				bat.on('exit', (code) => {
				console.log(`Child exited with code ${code}`);
			});*/
			
	
}

function iterFunction(){
	for(const e of assets){
		setTimeout(function() { gatherInfo(e.name,function(){}); },15000);
	}
}


setInterval(iterFunction,60000);


Date.hoursBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

function checkForFile(fileName,callback)
{
    fs.exists(fileName, function (exists) {
        if(exists)
        {
            callback();
        }else
        {
			json="{\"table\":[]}"
            fs.writeFile(fileName,json,{flag: 'wx',encoding:"utf8"}, function (err, data) 
            { 
                callback();
            })
        }
    });
}
	

module.exports = router;