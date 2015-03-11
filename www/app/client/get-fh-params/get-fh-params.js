angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.client.getFHParams', {
      url: '/get-fh-params',
      views: {
        'main@app': {
          controller: 'GetFHParamsCtrl',
          templateUrl: 'get-fh-params.tpl.html'
        }
      }
    });
  })

  .controller('GetFHParamsCtrl', function($scope, $mdToast){
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/app_api.html#app_api-_fh_getfhparams';
    $scope.docLabel = '$fh.getFHParams';

    $scope.fhParams = JSON.stringify($fh.getFHParams(), null, 4);
  })
;

