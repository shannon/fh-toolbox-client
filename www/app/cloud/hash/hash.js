angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud.hash', {
      url: '/hash',
      views: {
        'main@app': {
          controller: 'CloudHashCtrl',
          templateUrl: 'hash.tpl.html'
        }
      }
    });
  })

  .controller('CloudHashCtrl', function($scope, $mdToast){
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/cloud_api.html#cloud_api-_fh_hash';
    $scope.docLabel = '$fh.hash';
    $scope.algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];
    
    $scope.submit = function(){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/hash',
        'method': 'POST',
        'data': {
          algorithm:  $scope.data.algorithm,
          text:       $scope.data.text
        }
      }, function(res) {
        $scope.working = false;
        $scope.hashvalue = res.hashvalue;
        $scope.$apply();
      }, function(msg, err) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
        $scope.$apply();
      });
    }
  })
;

