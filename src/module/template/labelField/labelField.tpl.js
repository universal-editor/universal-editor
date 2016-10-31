(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/labelField/labelField.html',
    '\n' +
    '<label ng-if="!vm.options.filter" class="field-name-label">\n' +
    '    <div data-ng-if="vm.hint" class="field-hint">\n' +
    '        <div ng-bind="vm.hint" class="hint-text"></div>\n' +
    '    </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>\n' +
    '</label>');
}]);
})();
