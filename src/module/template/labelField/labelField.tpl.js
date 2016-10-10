(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/labelField/labelField.html',
    '\n' +
    '<label class="field-name-label">\n' +
    '    <div data-ng-if="vm.hint" class="field-hint">\n' +
    '        <div class="hint-text">{{vm.hint}}</div>\n' +
    '    </div><span data-ng-class="vm.required ? \'editor-required\' : \'\' ">{{vm.fieldDisplayName}}:</span>\n' +
    '</label>');
}]);
})();
