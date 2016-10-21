(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/errorField/errorField.html',
    '\n' +
    '<div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '    <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '</div>');
}]);
})();
