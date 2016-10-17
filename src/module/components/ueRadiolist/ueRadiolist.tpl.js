(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueRadiolist/ueRadiolist.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.filter}">\n' +
    '    <label ng-if="!vm.filter" class="field-name-label">\n' +
    '        <div data-ng-if="vm.hint" class="field-hint">\n' +
    '            <div ng-bind="vm.hint" class="hint-text"></div>\n' +
    '        </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.fieldDisplayName"></span>\n' +
    '    </label>\n' +
    '    <div ng-class="{\'filter-inner-wrapper\': vm.filter, \'field-element\': !vm.filter}">\n' +
    '        <label data-ng-repeat="item in vm.selectedValues" data-ng-class="{\'radiodisabled\': vm.readonly}" class="radio-inline">\n' +
    '            <input type="radio" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" value="{{item[vm.field_id]}}"/><span ng-bind="item[vm.field_search]"></span>\n' +
    '        </label>\n' +
    '    </div>\n' +
    '    <div ng-if="!vm.filter" class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
