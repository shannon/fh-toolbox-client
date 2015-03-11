angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.client.cloud', {
      url: '/cloud',
      views: {
        'main@app': {
          controller: 'CloudCtrl',
          templateUrl: 'cloud.tpl.html'
        }
      }
    });
  })

  .controller('CloudCtrl', function($scope, $mdToast){
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/app_api.html#app_api-_fh_cloud';
    $scope.docLabel = '$fh.cloud';

    $scope.submit = function(){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/cloud',
        'method': 'POST',
        'data': { name: $scope.data.name }
      }, function(res) {
        $scope.working = false;
        $scope.response = res.message;
        $scope.$apply();
      }, function(msg, err) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
        $scope.$apply();
      });
    }
  })
;

