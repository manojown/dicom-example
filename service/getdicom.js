"use strict";

var dicom = require("dicom");
var q = require('q');

function getdicom(){
  return {
    calldicom : calldicom
  };


  function calldicom(data){
    console.log(data,'filenamein dicom');
    var deferred = q.defer();

    var decoder = dicom.decoder({
        guess_header: true
    });

    var encoder = new dicom.json.JsonEncoder();

    var print_element = function(json, elem) {
      console.log(json);
        if(json){
         // console.log(json);
          deferred.resolve(json);
        }else{
          deferred.reject('error in dicom conversion');
        }
    };

    var sink = new dicom.json.JsonSink(function(err, json) {
        if (err) {
          console.log("Error:", err);
          process.exit(10);
        }
       print_element(json, dicom);
    });
      
      require("fs").createReadStream('./service/'+data).pipe(decoder).pipe(encoder).pipe(sink);
      return deferred.promise;
     
  }
  

}

module.exports = getdicom();