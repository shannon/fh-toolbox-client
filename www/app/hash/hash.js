angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.hash', {
      url: 'hash',
      views: {
        main: {
          controller: 'HashCtrl',
          templateUrl: 'hash.tpl.html'
        }
      }
    });
  })

  .controller('HashCtrl', function($scope, $mdToast){
    $scope.algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];

    $scope.submit = function(){
      $scope.working = true;

      $fh.hash({
        algorithm:  $scope.data.algorithm,
        text:       $scope.data.text
      }, function (res) {
        $scope.working = false;
        $scope.hashValue = res.hashvalue;
      }, function(msg) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Hash failed with error message: ' + msg));
      });
    }
  })
;

