var request = require('request');
var Fs = require('fs');
var q = require('q');
var dicom = require('./getdicom');

function service(){
	return {
		getPatients : getPatients,
    getStudies:getStudies,
    getSeries:getSeries,
    getInstance :getInstance,
    download :download

	};
/**
 * to download file and save into service folder
 *
 * @public
 *
 * @memberof   GetService.js
 *
 * @author     manoj
 *
 * @param      {string}  id      instance id to get file
 * @return     {promise}  { return promise wether its resolve or reject }
 */
 function download(id) {
  var deferred = q.defer();
  var url = 'http://35.154.52.109/instances/'+id+'/file';
  var dest = __dirname;   
  request.get( url )
    .on( 'response', function( res ){
        // extract filename
      var fff = res.headers['content-disposition'];
      var filename = fff.slice(fff.indexOf('"')+1,fff.length-1);
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
  /**
   * Gets the studies. get all studies related to patient
   *
   * @public
   *
   * @memberof    getService.js
   *
   * @author     manoj
   *
   * @param      {string}  id      patient identity
   * @return     {promise object}  The studies  { return promise wether its resolve or reject }.
   */
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
  
  /**
   * Gets the patients details like studies series. 
   *
   * @public
   *
   * @memberof   getService.js
   *
   * @author     manoj
   *
   * @param      {array}  body  all patients 
   * @return     {<type>}  The patients.
   */
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
	/**
   * Gets the series related to patients.
   *
   * @public
   *
   * @memberof   getService.js
   *
   * @author     manoj
   *
   * @param      {string}  id      The identifier for patient
   * @return     {Promise object}  The series realated to perticular patient.
   */
  function getSeries(id){
    var deferred = q.defer(); 
    request('http://35.154.52.109/patients/'+id+'/series', function (error, response, data) {
       if(error){
        return deferred.reject('error');
      }
      var newdata = JSON.parse(data);
      deferred.resolve(newdata);
    });
    return deferred.promise;
  }
  /**
   * Gets the instance related to patient.
   *
   * @public
   *
   * @memberof   getService.js
   *
   * @author     manoj
   *
   * @param      {string}  id      The identifier for patient
   * @return     {Promise object}  The instance realted to  individual patient.
   */
  function getInstance(id){
    var deferred = q.defer();
    request('http://35.154.52.109/patients/'+id+'/instances', function (error, response, data) {
       if(error){
        return deferred.reject('error');
      }
      var newdata = JSON.parse(data);
      deferred.resolve(newdata);
    });     
    return deferred.promise;
  }
}
module.exports = service();