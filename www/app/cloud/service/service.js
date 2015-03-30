angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud.service', {
      url: '/service',
      views: {
        'main@app': {
          controller: 'ServiceCtrl',
          templateUrl: 'service.tpl.html'
        }
      }
    });
  })

  .controller('ServiceCtrl', function($scope, $mdToast){
    $scope.$root.docUrl = 'http://docs.feedhenry.com/v3/api/cloud_api.html#cloud_api-_fh_service';
    $scope.$root.docLabel = '$fh.service';
    
    $scope.submit = function(){
      $scope.working = true;

      var params;

      try {
        params = JSON.parse($scope.data.params);
      } catch(e) {
        return $mdToast.show($mdToast.simple().position('top right').content('Invalid Params (JSON)'));
      }

      $fh.cloud({
        path: '/api/v1/service',
        'method': 'POST',
        'data': { 
          guid:   $scope.data.guid,
          path:   $scope.data.path,
          method: $scope.data.method,
          params: params
        }
      }, function(res) {
        $scope.working = false;
        $scope.response = res;
        $scope.$apply();
      }, function(msg, err) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
        $scope.$apply();
      });
    }
  })
;

