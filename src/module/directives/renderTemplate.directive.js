let angular = window.angular;

function onRenderTemplate($timeout, $compile) {
  'ngInject';
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element) {
      var vm = scope.vm;

      //render html-content from template-property in settings of the component (ue-button)
      if (angular.isString(vm.template)) {
        element.addClass('button-template');
        insertHtml(element, vm.template);
      } else if (angular.isObject(vm.templates)) {

        //render html-content from templates-object in settings of the component (ue-autocomplete, ue-string and etc.)
        if (vm.templates.filter && vm.options.filter) {
          element.addClass('component-filter');
          insertHtml(element, vm.templates.filter);
        } else if (vm.templates.edit && vm.regim === 'edit') {
          element.addClass('component-edit');
          insertHtml(element, vm.templates.edit);
        } else if (vm.templates.preview && vm.templates.preview && vm.regim === 'preview') {
          element.addClass('component-preview');
          insertHtml(element, vm.templates.preview);
        } else {

          // removed component if templates-object is declared but the template is not found
          element.remove();
        }
      } else {
        element.remove();
      }
      function insertHtml(element, html) {
        element.html($compile(angular.element(html))(scope));
      }
    }
  };
}

export { onRenderTemplate };
