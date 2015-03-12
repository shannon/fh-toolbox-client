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
                path: '/api/v1/cache/entry',
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
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/cloud_api.html#cloud_api-_fh_cache';
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
        path: '/api/v1/cache/entry',
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
        path: '/api/v1/cache/entry',
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

