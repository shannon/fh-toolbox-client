angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.client.getCloudURL', {
      url: '/get-cloud-url',
      views: {
        'main@app': {
          controller: 'GetCloudURLCtrl',
          templateUrl: 'get-cloud-url.tpl.html'
        }
      }
    });
  })

  .controller('GetCloudURLCtrl', function($scope, $mdToast){
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/app_api.html#app_api-_fh_getcloudurl';
    $scope.docLabel = '$fh.getCloudURL';

    $scope.cloudURL = $fh.getCloudURL();
  })
;

