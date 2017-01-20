(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/templatesForComponents/filter.html',
    '\n' +
    '<label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">\n' +
    '    <div data-ng-if="!!vm.hint" class="field-hint">\n' +
    '        <div ng-bind="::vm.hint" class="hint-text"></div>\n' +
    '    </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="::vm.label"></span>\n' +
    '</label>\n' +
    '<div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}" style="{{vm.checkBoxStyle}}"> \n' +
    '    <div data-ng-repeat="item in vm.optionValues" data-ng-class="{\'disabled\': vm.readonly}" class="checkbox checkbox-inline">\n' +
    '        <input type="checkbox" data-ng-disabled="vm.readonly" data-checklist-model="vm.fieldValue" data-checklist-value="item[vm.fieldId]"/><span ng-bind="item[vm.fieldSearch]"></span>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
