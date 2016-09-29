(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueFormGroup/ueFormGroup.html',
    '\n' +
    '<div class="editor-field-array">\n' +
    '    <div class="field-name-label label-array">\n' +
    '        <div data-ng-if="vm.hint" class="field-hint">\n' +
    '            <div class="hint-text">{{vm.hint}}</div>\n' +
    '        </div>{{vm.fieldDisplayName}}\n' +
    '    </div>\n' +
    '    <div class="field-array-wrapper">\n' +
    '        <data-field-wrapper data-ng-repeat="field in vm.innerFields" data-field-name="{{field}}" data-parent-field="{{vm.fieldName}}" data-setting="field"></data-field-wrapper>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
