(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueCheckbox/ueCheckbox.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.options.filter}">\n' +
    '    <label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">\n' +
    '        <div data-ng-if="!!vm.hint" class="field-hint">\n' +
    '            <div ng-bind="vm.hint" class="hint-text"></div>\n' +
    '        </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>\n' +
    '    </label>\n' +
    '    <div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}"> \n' +
    '        <div data-ng-if="vm.multiple">\n' +
    '            <div data-ng-repeat="field_item in vm.fieldValue track by $index" ng-init="i = $index" class="item-string-wrapper input-group">\n' +
    '                <div data-ng-repeat="item in vm.optionValues" data-ng-class="{\'disabled\': vm.readonly}" class="checkbox">\n' +
    '                    <label>\n' +
    '                        <input type="checkbox" data-ng-disabled="vm.readonly" data-checklist-model="vm.fieldValue[i]" data-checklist-value="item[vm.field_id]"/><span ng-bind="item[vm.field_search]"></span>\n' +
    '                    </label>\n' +
    '                </div><span class="input-group-btn">\n' +
    '                    <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '            </div>\n' +
    '            <div data-ng-click="vm.addItem()" data-ng-disabled="vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple">\n' +
    '            <div data-ng-repeat="item in vm.optionValues" data-ng-class="{\'disabled\': vm.readonly}" class="checkbox">\n' +
    '                <label>\n' +
    '                    <input type="checkbox" data-ng-disabled="vm.readonly" data-checklist-model="vm.fieldValue" data-checklist-value="item[vm.field_id]"/><span ng-bind="item[vm.field_search]"></span>\n' +
    '                </label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
