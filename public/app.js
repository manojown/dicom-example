
var app = angular.module("myApp", ['ui.router']);

app.controller("myCtrl", function($scope,$http,$rootScope,$state) {
  
  $scope.getInstances  = getInstances;
  $scope.sendtostudies = sendtostudies;

  getInstances();
  function getInstances(){
       $http.post('/getIntance').then(function(data){
        //console.log(data);
        $scope.patients = data.data;
       
      });
  }
  function sendtostudies(patient){
    $state.go('studies',{obj:patient});
  }

  

   });
app.controller("StudiesCtrl", function($scope,$http,$rootScope,$stateParams) {

  $scope.id = $stateParams.id;
  getStudies( $scope.id );
  function getStudies(id){
    
    $http.post('/getstudies', {data:id}).then(function(data){
        //console.log(data);
        $scope.studies = data.data;
        $scope.patient = data.data[0].PatientMainDicomTags;
        
        $rootScope.patient = data.data[0].PatientMainDicomTags;
        $rootScope.study = data.data[0];
      });
  }

 
});

app.controller("SeriesCtrl", function($scope,$http,$rootScope,$stateParams) {
  $scope.id = $stateParams.id;

 
  $scope.setseries = setseries;

  getSeries($scope.id );
   function getSeries(id){
      $http.post('/getseries',{data:id}).then(function(data){

        //console.log(data);
        $scope.series = data.data;
         
        
      });
   }

  function setseries(data){
    $rootScope.indiSeries = data;
  }
});

app.controller("InstanceCtrl", function($scope,$http,$rootScope,$stateParams) {
  $scope.id = $stateParams.id;

console.log('INstance controler');
 $scope.getTage = getTage;
 function getTage(instanceid){
  $rootScope.intancesside = instanceid;
  console.log('in getall tag in out');
   $http.post('/getalltags',{data:instanceid.ID}).then(function(data){
      console.log('in getall tag in res');
        console.log(data,'alltags');
        $rootScope.dicomTags = data.data;
        
        
      });
 }


  getInstances($scope.id );
   function getInstances(id){
      $http.post('/getinstances',{data:id}).then(function(data){

       // console.log(data);
        $scope.instances = data.data;
        
        
      });
   }

 
});

app.config(function($stateProvider, $urlRouterProvider)
{

   

    $stateProvider
    
        .state('patients', {
          url: '/patients/:id',
          templateUrl: 'views/studies.html',
          controller: 'StudiesCtrl',
          params: {
            obj: null
          }
        }).state('home', {
          url: '/home',
 
          templateUrl: 'views/home.html',
          controller: 'myCtrl'
        }).state('series', {
          url: '/patients/:id/series',
 
          templateUrl: 'views/series.html',
          controller: 'SeriesCtrl'
        }).state('instances', {
          url: '/patients/:id/instances',
 
          templateUrl: 'views/instances.html',
          controller: 'InstanceCtrl'
        })
        .state('alltags', {
          url: '/patients/:id/instances/alltag',
 
          templateUrl: 'views/alltags.html',
          controller: 'InstanceCtrl'
        });
});

