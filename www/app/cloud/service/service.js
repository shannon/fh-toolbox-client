angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud.service', {
      url: '/service',
      views: {
        'main@app': {
          controller: 'ServiceCtrl',
          templateUrl: 'cloud.tpl.html'
        }
      }
    });
  })

  .controller('ServiceCtrl', function($scope, $mdToast){
    $scope.docUrl = 'https://support-lon3.feedhenry.com/docs/api/cloud_api.html#cloud_api-_fh_service';
    $scope.docLabel = '$fh.service';
    
    $scope.submit = function(){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/service',
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

