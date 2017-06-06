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
          if (vm.templates.filter && vm.options.filter) {
            element.addClass('component-filter');
            insertHtml(element, vm.templates.filter);
          } else if (vm.templates.edit && vm.regim === 'edit') {
            element.addClass('component-edit');
            insertHtml(element, vm.templates.edit);
          } else if (vm.templates.preview && vm.templates.preview && vm.regim === 'preview') {
            element.addClass('component-preview');
            insertHtml(element, vm.templates.preview);
          } else if (vm.template) {
            element.addClass('button-template');
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