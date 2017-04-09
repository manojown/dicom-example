
var app = angular.module("myApp", ['ui.router']);
/**
 * myCtrl for index file just   use to load patient all id's
 */
app.controller("myCtrl", function($scope,$http,$rootScope,$state) {
  $scope.getInstances  = getInstances;
 
  getInstances();
  function getInstances(){
       $http.post('/getIntance').then(function(data){
        $scope.patients = data.data;
      });
  }
  // function sendtostudies(patient){
  //   $state.go('studies',{obj:patient});
  // }

  // for above is good method but for sending object but for time consumming i use $rootScope
});

/**
 * to fetch studies related to current patient id
 */
app.controller("StudiesCtrl", function($scope,$http,$rootScope,$stateParams) {

  $scope.id = $stateParams.id;
  getStudies( $scope.id );
  function getStudies(id){
    $http.post('/getstudies', {data:id}).then(function(data){
      $scope.studies = data.data;
      $scope.patient = data.data[0].PatientMainDicomTags;
      $rootScope.patient = data.data[0].PatientMainDicomTags;
      $rootScope.study = data.data[0];
      });
  }
});

/**
 * current series related to patient
 */
app.controller("SeriesCtrl", function($scope,$http,$rootScope,$stateParams) {
  $scope.id = $stateParams.id;
  $scope.setseries = setseries;
  getSeries($scope.id );
   function getSeries(id){
      $http.post('/getseries',{data:id}).then(function(data){
        $scope.series = data.data; 
      });
   }
  function setseries(data){
    $rootScope.indiSeries = data;
  }
});

/**
 * get instance related to patient
 */
app.controller("InstanceCtrl", function($scope,$http,$rootScope,$stateParams) {
  $scope.id = $stateParams.id;
  $scope.getTage = getTage;
  function getTage(instanceid){
    $rootScope.intancesside = instanceid;
    $http.post('/getalltags',{data:instanceid.ID}).then(function(data){
      $rootScope.dicomTags = data.data;    
      console.log( data.data);
    });
  }
  getInstances($scope.id );
   function getInstances(id){
      $http.post('/getinstances',{data:id}).then(function(data){
        $scope.instances = data.data;    
       // console.log( $scope.instances);
      });
   }
});

app.config(function($stateProvider, $urlRouterProvider){
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

