angular.module('app', [
  'ngMaterial', 
  'templateImport', 
  'ui.router'
  ])

  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider){
    $locationProvider.html5Mode(false).hashPrefix('!');

    $mdThemingProvider.theme('default')
      // .primaryPalette('blue-grey')
      // .accentPalette('blue')
    ;

    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('app', {
      url: '/',
      controller: 'AppCtrl',
      templateUrl: 'app.tpl.html'
    });

    $mdIconProvider
      .iconSet('content',     'app/lib/iconsets/content-icons.svg')
      .iconSet('action',      'app/lib/iconsets/action-icons.svg')
      .iconSet('file',        'app/lib/iconsets/file-icons.svg')
      .iconSet('hardware',    'app/lib/iconsets/hardware-icons.svg')
      .iconSet('device',      'app/lib/iconsets/device-icons.svg')
      .iconSet('navigation',  'app/lib/iconsets/navigation-icons.svg')
    ;
  })

  .controller('AppCtrl', function($scope, $mdSidenav, $log, $mdMedia){
    $scope.navLinks = {
      ' $fh.cloud': 'app.cloud'
    };

    $scope.toggleNav = function() {
      $mdSidenav('nav').toggle();
    };

    $scope.$mdMedia = $mdMedia; //patch until angular-material 0.8.3
  })
;

