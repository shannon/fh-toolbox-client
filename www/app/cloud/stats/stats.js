angular.module('app')

  .config(function($stateProvider){
        
    $stateProvider.state('app.cloud.stats', {
      url: '/stats',
      views: {
        'main@app': {
          controller: 'StatsCtrl',
          templateUrl: 'stats.tpl.html',
        }
      }
    });
  })

  .controller('StatsCtrl', function($scope){
    $scope.$root.docUrl = 'http://docs.feedhenry.com/v3/api/cloud_api.html#cloud_api-_fh_stats';
    $scope.$root.docLabel = '$fh.stats';
  })
;

