
var express =  require('express');
var app = express();

var bodyParser = require('body-parser');
var service =  require('./service/getService');
var request = require('request');




app.use(bodyParser.json());

app.use(express.static('public'));


app.post('/getstudies',function(req,res){
	var studies  =  req.body.data;
	
		
		
  service.getStudies(studies)
  .then(function(result){
  	
  	res.send(result);
  })
  .catch(function(err){
  	console.log(err);
  });
  //console.log('body:', body); // Print the HTML for the Google homepage.
  

});
app.post('/getIntance',function(req,res){
	request('http://35.154.52.109/patients', function (error, response, body) {
		var data = [];
		data = JSON.parse(body);
		
  service.getPatients(data)
  .then(function(result){
  	
  	res.send(result);
  })
  .catch(function(err){
  	console.log(err);
  });
  //console.log('body:', body); // Print the HTML for the Google homepage.
  
});
});
app.post('/getseries',function(req,res){
	var studies  =  req.body.data;
	
		
		
  service.getSeries(studies)
  .then(function(result){
  	
  	res.send(result);
  })
  .catch(function(err){
  	console.log(err);
  });
  //console.log('body:', body); // Print the HTML for the Google homepage.
  

});
app.post('/getinstances',function(req,res){
	var patient  =  req.body.data;
	
		
		
  service.getInstance(patient)
  .then(function(result){
  	
  	res.send(result);
  })
  .catch(function(err){
  	console.log(err);
  });
  //console.log('body:', body); // Print the HTML for the Google homepage.
  

});
app.post('/getalltags',function(req,res){
	
	var instanceId = req.body.data;
	
		console.log(instanceId);
		
  service.download(instanceId)
  .then(function(result){
  	console.log(result,'result');
  	res.send(result);
  })
  .catch(function(err){
  	console.log(err);
  });
  //console.log('body:', body); // Print the HTML for the Google homepage.
  

});
app.get('/',function(req,res){
	session = req.session;
	console.log(session.id +" 888888asdas");
	if(session.id){
			res.redirect('/login');
	}else{
	
		res.sendFile('./public/views/index.html',{root:__dirname});
	}
	
});

app.listen(process.env.PORT || 3005,function(err)
{
	if(err)
	{
		console.log(err);
		console.log("listen failed");
	}
	else{ console.log("listen on 3005 port");}
});