angular
  .module('universal-editor')
  .directive('onRenderTemplate', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attr) {
        var vm = scope.vm;
        if (angular.isString(vm.template)) {
          insertHtml(element, vm.template);
        } else if (angular.isObject(vm.templates)) {
          if (vm.templates.filter && element.hasClass('component-filter')) {
            insertHtml(element, vm.templates.filter);
          } else if (vm.templates.edit && element.hasClass('component-edit')) {
            insertHtml(element, vm.templates.edit);
          } else if (vm.templates.preview && element.hasClass('component-preview')) {
            insertHtml(element, vm.templates.preview);
          } else if (element.hasClass('button-template')) {
            insertHtml(element, vm.templates);
          } else {
            element.remove();
          }
        } else {
          element.remove();
        }
        function insertHtml(el, html) {
          element.html($compile(angular.element(html))(scope));
        }
      }
    };
  }]);