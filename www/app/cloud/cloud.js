angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud', {
      url: 'cloud',
      views: {
        main: {
          controller: 'CloudCtrl',
          templateUrl: 'cloud.tpl.html'
        }
      }
    });
  })

  .controller('CloudCtrl', function($scope, $mdToast){
    var position = 'top right';

    $scope.save = function(){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/cloud',
        'method': 'POST',
        'data': { name: $scope.data.name }
      }, function(res) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position(position).content(res.message));
      }, function(msg, err) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position(position).content('Cloud call failed with error message: ' + msg));
      });
    }
  })
;

