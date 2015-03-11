angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.client.hash', {
      url: '/hash',
      views: {
        'main@app': {
          controller: 'ClientHashCtrl',
          templateUrl: 'hash.tpl.html'
        }
      }
    });
  })

  .controller('ClientHashCtrl', function($scope, $mdToast){
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/app_api.html#app_api-_fh_hash';
    $scope.docLabel = '$fh.hash';
    $scope.algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];

    $scope.submit = function(){
      $scope.working = true;

      $fh.hash({
        algorithm:  $scope.data.algorithm,
        text:       $scope.data.text
      }, function (res) {
        $scope.working = false;
        $scope.hashvalue = res.hashvalue;
      }, function(msg) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Hash failed with error message: ' + msg));
      });
    }
  })
;

