angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud.db', {
      url: '/db',
      views: {
        'main@app': {
          controller: 'DbCtrl',
          templateUrl: 'db.tpl.html',
          resolve: {
            entries: function($q, $mdToast){
              var deferred = $q.defer();

              $fh.cloud({
                path: '/api/v1/db',
                method: 'GET'
              }, function(res) {
                deferred.resolve(res.list);
              }, function(msg, err){
                $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
                deferred.resolve([]);
              });

              return deferred.promise;
            }
          }
        }
      }
    });
  })

  .controller('DbCtrl', function($scope, $mdToast, $mdDialog, $q, entries){
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/cloud_api.html#cloud_api-_fh_db';
    $scope.docLabel = '$fh.db';

    $scope.entries = entries;

    function push(entry){
      if(!$scope.entries.some(function(e){
        return e.guid === entry.guid;
      })){
        $scope.entries.push(entry);
      }
    }

    function pull(entry){
      $scope.entries.splice($scope.entries.indexOf(entry), 1);
    }

    function error(msg, err){
      $scope.working = false;
      $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
      $scope.$apply();
    }

    $scope.save = function(entry, edit){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/db' + (edit.guid ? '/' + edit.guid : ''),
        method: 'POST',
        data: edit.fields
      }, function(res) {
        $scope.working = false;
        angular.copy(res, entry);
        push(entry);

        $scope.$apply();
      }, error);
    };

    $scope.delete = function(entry){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/db/' + entry.guid,
        method: 'DELETE',
        data: {}
      }, function(res) {
        $scope.working = false;
        pull(entry);
        $scope.$apply();
      }, error);
    };

    $scope.edit = function(ev, entry){

      $mdDialog.show({
        controller: function($scope, $mdDialog, entry){
          $scope.entry = entry;

          $scope.cancel = function(){
            $mdDialog.cancel();
          };

          $scope.save = function(){
            $mdDialog.hide(entry);
          }
        },
        templateUrl: 'add-entry.tpl.html',
        targetEvent: ev,
        clickOutsideToClose: false,
        resolve: {
          
          entry: function(){

            if(!entry.guid){
              return entry;
            }

            var deferred = $q.defer();

            $fh.cloud({
              path: '/api/v1/db/' + entry.guid,
              method: 'GET'
            }, function(res) {
              deferred.resolve(res);
            }, function(msg, err){
              error(msg, err);
              deferred.reject(msg);
            });

            return deferred.promise;
          }
        }
      })
      .then(function(edit) {
        $scope.save(entry, edit);
      });
    };

    $scope.clear = function(){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/db',
        method: 'DELETE',
        data: {}
      }, function(res) {
        $scope.entries.length = 0;
        $scope.$apply();
      }, error);
    };
  })
;

