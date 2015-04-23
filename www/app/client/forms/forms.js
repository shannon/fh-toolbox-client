angular.module('app')

  .config(function($stateProvider){
  
    $stateProvider.state('app.client.forms', {
      url: '/forms',
      views: {
        'main@app': {
          controller: 'FormsCtrl',
          templateUrl: 'forms.tpl.html',
          resolve: {
            forms: ['fhForms', function(fhForms){
              return fhForms.getForms({ fromRemote: true }).then(function(forms){
                return forms.getFormsList();
              });
            }] 
          }
        }
      }
    });
  
    $stateProvider.state('app.client.forms.form', {
        url: '/:form',
        views: {
          'main@app': {
            controller: 'FormCtrl',
            templateUrl: 'form.tpl.html'
          }
        }
      });
  })

  .controller('FormsCtrl', function($scope, $mdToast, $timeout, forms){
    $scope.$root.docUrl = 'http://docs.feedhenry.com/v3/api/app_api.html#app_api-_fh_forms';
    $scope.$root.docLabel = '$fh.forms';
    $scope.forms = forms;
    
  })

  .controller('FormCtrl', function($scope, $mdToast, $timeout, $stateParams){
    $scope.$root.docUrl = '';
    $scope.$root.docLabel = '';
    $scope.form = $stateParams.form;
  })

;

