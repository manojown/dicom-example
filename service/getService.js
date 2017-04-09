var request = require('request');
var Fs = require('fs');
var q = require('q');
var dicom = require('./getdicom');
var regexp = /filename=\"(.*)\"/gi;
function service(){
	return {
		getPatients : getPatients,
    getStudies:getStudies,
    getSeries:getSeries,
    getInstance :getInstance,
    download :download

	};
/////////////////////////////////////////////////////
 function download(id) {
  var deferred = q.defer();
    var url = 'http://35.154.52.109/instances/'+id+'/file';
    var dest = __dirname;
    //console.log(dest,url);
   request.get( url )
     .on( 'response', function( res ){

        // extract filename
       var fff = res.headers['content-disposition'];
       var filename = fff.slice(fff.indexOf('"')+1,fff.length-1);
       
       // var filename = regexp.exec( res.headers['content-disposition'] )[1];

        // create file write stream
        var fws = Fs.createWriteStream( dest+'/' + filename );

        // setup piping
        res.pipe( fws );

        res.on( 'end', function(){
         
         deferred.resolve(dicom.calldicom(filename));
        });

        
    });
     return  deferred.promise;
}

  function getStudies(id){
  var deferred = q.defer();
  
    request('http://35.154.52.109/patients/'+id+'/studies', function (error, response, data) {
       if(error){
        return deferred.reject('error');
      }
      var newdata = JSON.parse(data);
      deferred.resolve(newdata);

    });

      
     
      return deferred.promise;
    }
  

	function getPatients(body){
		var deferred = q.defer();
		var array = [];
  	var i=0;
  	if(body){
  		body.forEach(function(patient){

  				request('http://35.154.52.109/patients/'+patient, function (error, response, data) {
  					var newdata = JSON.parse(data);
  					array.push(newdata);
  					i++;
  					if(body.length<=i){
  						deferred.resolve(array);
  					}
  				});

  		});
  	} else {
  		deferred.reject('error');
  	}
  	return deferred.promise;
  
};
	
  function getSeries(id){
     var deferred = q.defer();
  
    request('http://35.154.52.109/patients/'+id+'/series', function (error, response, data) {
       if(error){
        return deferred.reject('error');
      }
      var newdata = JSON.parse(data);
      //console.log(newdata);
      deferred.resolve(newdata);

    });

      
     
      return deferred.promise;
  }

  function getInstance(id){
    var deferred = q.defer();
  
    request('http://35.154.52.109/patients/'+id+'/instances', function (error, response, data) {
       if(error){
        return deferred.reject('error');
      }
      var newdata = JSON.parse(data);
     // console.log(newdata);
      deferred.resolve(newdata);

    });

      
     
      return deferred.promise;
  }

}
module.exports = service();