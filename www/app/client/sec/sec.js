angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.client.sec', {
      url: '/sec',
      views: {
        'main@app': {
          controller: 'ClientSecCtrl',
          templateUrl: 'sec.tpl.html'
        }
      }
    });
  })

  .controller('ClientSecCtrl', function($scope, $mdToast, $timeout){
    $scope.docUrl = 'http://docs.feedhenry.com/v3/api/app_api.html#app_api-_fh_sec';
    $scope.docLabel = '$fh.sec';

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

      $fh.sec({ act: 'keygen', params: { algorithm: 'AES', keysize: $scope.data.keysize['AES'] } }, function(res){
        $scope.working = false;
        $scope.data.private = res.secretkey;
        $scope.data.public = res.iv;
      }, function(msg) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('KeyGen failed with error message: ' + msg));
      });
    };

    $scope.decrypt = function(msg){
      $timeout.cancel(msg.timeout);

      if(msg.plaintext){
        delete msg.plaintext;
      } else {
        $scope.working = true;

        $fh.sec({
          act: 'decrypt',
          params: {
            algorithm:  msg.algorithm,
            key:        msg.private,
            iv:         msg.public,
            ciphertext: msg.ciphertext
          }
        }, function (res) {
          $scope.working = false;

          msg.plaintext = res.plaintext;
          msg.timeout = $timeout(function(){
            delete msg.plaintext;
          }, 5000);

        }, function(msg) {
          $scope.working = false;
          $mdToast.show($mdToast.simple().position('top right').content('Decrypt failed with error message: ' + msg));
        });
      };
    };

    $scope.encrypt = function(){
      $scope.working = true;

      $fh.sec({
        act: 'encrypt',
        params: {
          algorithm:  $scope.data.algorithm,
          key:        $scope.data.private,
          iv:         $scope.data.public,
          plaintext: $scope.data.text
        }
      }, function (res) {
        $scope.working = false;
        $scope.data.text = '';
        $scope.encrypted.push({
          algorithm:  $scope.data.algorithm,
          private:    $scope.data.private,
          public:     $scope.data.public,
          ciphertext: res.ciphertext
        });
      }, function(msg) {
        $scope.working = false;
        $mdToast.show($mdToast.simple().position('top right').content('Encrypt failed with error message: ' + msg));
      });
    };
  })
;

