(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueTextarea/ueTextarea.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.options.filter, \'filter-wrapper-field\': vm.options.filter}">\n' +
    '    <label ng-if="!vm.options.filter" class="field-name-label">\n' +
    '        <div data-ng-if="vm.hint" class="field-hint">\n' +
    '            <div ng-bind="vm.hint" class="hint-text"></div>\n' +
    '        </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>\n' +
    '    </label>\n' +
    '    <div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}">\n' +
    '        <div data-ng-if="vm.multiple" data-ng-class="vm.classComponent">\n' +
    '            <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-textarea-wrapper">\n' +
    '                <textarea name="{{vm.fieldName}}" rows="{{vm.rows}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue[$index]" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" data-ng-trim="false" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" class="form-control editor-textarea"></textarea>\n' +
    '                <div data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</div>\n' +
    '            </div>\n' +
    '            <div data-ng-click="vm.addItem()" data-ng-disabled="vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple" data-ng-class="vm.classComponent">\n' +
    '            <textarea name="{{vm.fieldName}}" rows="{{vm.rows}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" data-ng-blur="vm.inputLeave(vm.fieldValue)" data-ng-trim="false" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" class="form-control editor-textarea"></textarea>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '    <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '</div>');
}]);
})();
