angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud.sec', {
      url: '/sec',
      views: {
        'main@app': {
          controller: 'CloudSecCtrl',
          templateUrl: 'sec.tpl.html'
        }
      }
    });
  })

  .controller('CloudSecCtrl', function($scope, $mdToast, $timeout){
    $scope.$root.docUrl = 'http://docs.feedhenry.com/v3/api/cloud_api.html#cloud_api-_fh_sec';
    $scope.$root.docLabel = '$fh.sec';
    $scope.allowRSA = true;

    $scope.data = {
      algorithm: 'AES',
      keysize: {
        AES: 128,
        RSA: 1024
      }
    };

    $scope.encrypted = [];

    $scope.generate = function(){
      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/sec',
        'method': 'POST',
        'data': {
          act: 'keygen',
          params: {
            algorithm:  $scope.data.algorithm,
            keysize:    $scope.data.keysize[$scope.data.algorithm]
          }
        }
      }, function(res) {
        $scope.working = false;
        $scope.data.public  = res.public || res.iv;
        $scope.data.private = res.private || res.secretkey;
        $scope.data.modulo  = res.modulo;

        $scope.$apply();
      }, function(msg, err) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
        $scope.$apply();
      });
    };

    
    $scope.decrypt = function(msg){
      $timeout.cancel(msg.timeout);

      if(msg.plaintext){
        delete msg.plaintext;
      } else {
        $scope.working = true;

        $fh.cloud({
          path: '/api/v1/sec',
          'method': 'POST',
          'data': {
            act: 'decrypt',
            params: {
              algorithm:  msg.algorithm,
              key:        msg.private,
              iv:         msg.public,
              private:    msg.private,
              ciphertext: msg.ciphertext
            }
          }
        }, function(res) {
          $scope.working = false;

          msg.plaintext = res.plaintext;
          msg.timeout = $timeout(function(){
            delete msg.plaintext;
          }, 5000);

          $scope.$apply();
        }, function(msg, err) {
          $scope.working = false;
          $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
          $scope.$apply();
        });
      }
      
    };

    $scope.encrypt = function(){

      $scope.working = true;

      $fh.cloud({
        path: '/api/v1/sec',
        'method': 'POST',
        'data': {
          act: 'encrypt',
          params: {
            algorithm:  $scope.data.algorithm,
            key:        $scope.data.private,
            iv:         $scope.data.public,
            public:     $scope.data.public,
            plaintext:  $scope.data.text
          }
        }
      }, function(res) {
        $scope.working = false;
        $scope.data.text = '';

        $scope.encrypted.push({
          algorithm:  $scope.data.algorithm,
          public:     $scope.data.public,
          private:    $scope.data.private,
          modulo:     $scope.data.modulo,
          ciphertext: res.ciphertext
        });

        $scope.$apply();
      }, function(msg, err) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Cloud call failed with error message: ' + msg));
        $scope.$apply();
      });

      $scope.working = true;
    };
  })
;

