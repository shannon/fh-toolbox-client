angular.module('fhForms', [])
  .factory('fhForms', ['$q', function($q){
    
    var FormView = $fh.forms.backbone.FormView.extend({
      initialize: function(params) {
        var self = this;
        self.options = params || {};
        $fh.forms.backbone.FormView.prototype.initialize.apply(this, params);

        if (params.form) {
          params.formId = params.form.getFormId();
        }

        this.loadForm(params, function() {
          self.trigger("loaded");
          if (params.autoShow) {
            self.$el.show();
          }
          self.render();
        });
      },
      submit: function(){
        $fh.forms.backbone.FormView.prototype.submit.apply(this, arguments);
        this.trigger('submit');
      }
    });
    
    function callMethod(method, params){
      var deferred = $q.defer();
      $fh.forms[method](params, function(err, data){
        if(err){ return deferred.reject(err); }
        deferred.resolve(data);
      });
      return deferred.promise;
    };
  
    return {
      getForms: function(params){
        return callMethod('getForms', params || {});
      },
      getForm: function(params){
        return callMethod('getForm', params || {});
      },
      getTheme: function(params){
        return callMethod('getTheme', params || {});
      },
      render: function(form, el){
        var view = new FormView({
          "parentEl": $(el),
          "form": form
        });
        
        return view;
      }
    }
  }])

  .directive('fhForm', ['fhForms', function(fhForms){
    return {
      restrict: 'A',
      scope: {
        form: '=fhForm'
      },
      template: '<div ng-include="getContentUrl()"></div>',
      link: function($scope, elem, attrs){
        $scope.getContentUrl = function() {
          return attrs.template;
        }
        
        fhForms.getForm({ formId: $scope.form, fromRemote: true }).then(function(form){
          var view = fhForms.render(form, elem[0]);
          view.on('submit', function(){
            $scope.$emit('submit', form);
          });
        });
      }
    }
  }])

  .run(['fhForms', function(fhForms){
    var head = angular.element(document.querySelector('head'));
    fhForms.getTheme({ css: true, fromRemote: true }).then(function(css){
      head.append('<style id="fh_appform_style">' + css + '</style>');
    });
  }])

  .config(function(){
    $fh.forms.init({}, function(){
      console.log('Forms Initialized');
    });
  })
;

