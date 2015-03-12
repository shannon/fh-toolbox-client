angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud.cache', {
      url: '/cache',
      views: {
        'main@app': {
          controller: 'CacheCtrl',
          templateUrl: 'cache.tpl.html',
          resolve: {
            cache: function($q, $mdToast){
              var deferred = $q.defer();

              $fh.cloud({
                path: '/api/v1/cache',
                method: 'GET'
              }, function(res) {
                deferred.resolve(res);
              }, function(msg, err){
                $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
                deferred.resolve(null);
              });

              return deferred.promise;
            }
          }
        }
      }
    });
  })

  .controller('CacheCtrl', function($scope, $mdToast, $timeout, cache){
    $scope.docUrl = 'https://support-lon3.feedhenry.com/docs/api/cloud_api.html#cloud_api-_fh_cache';
    $scope.docLabel = '$fh.cache';

    $scope.cache = cache;

    function error(msg, err){
      $scope.working = false;
      $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
      $scope.$apply();
    }

    $scope.submit = function(){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/cache',
        method: 'POST',
        data: { value: $scope.data.value }
      }, function(res) {
        $scope.working = false;
        $scope.cache = res;
        $scope.$apply();
      }, error);
    };

    $scope.clear = function(entry){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/cache',
        method: 'DELETE'
      }, function(res) {
        $scope.working = false;
        $scope.cache = null;
        $scope.$apply();
      }, error);
    };

    var expiration;
    $scope.$watch('cache', function(cache){
      if(cache){
        $timeout.cancel(expiration);
        expiration = $timeout(function(){
          $scope.cache = null;
        }, cache.expire - Date.now());
        
      }
    });
  })
;

