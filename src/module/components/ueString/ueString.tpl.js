(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueString/ueString.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.options.filter, \'filter-wrapper-field\': vm.options.filter}">\n' +
    '    <label ng-if="!vm.options.filter" class="field-name-label">\n' +
    '        <div data-ng-if="vm.hint" class="field-hint">\n' +
    '            <div ng-bind="vm.hint" class="hint-text"></div>\n' +
    '        </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>\n' +
    '    </label>\n' +
    '    <div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}">\n' +
    '        <div data-ng-if="vm.multiple" data-ng-class="vm.classComponent">\n' +
    '            <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-string-wrapper input-group">\n' +
    '                <input type="{{vm.fieldIsNumber ? \'number\' : \'text\'}}" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue[$index]" step="{{vm.stepNumber}}" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" ng-trim="false" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                    <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '            </div>\n' +
    '            <div data-ng-click="vm.addItem()" data-ng-disabled="vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple" data-ng-class="vm.classComponent">\n' +
    '            <input type="{{vm.fieldIsNumber ? \'number\' : \'text\'}}" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue" step="{{vm.stepNumber}}" data-ng-blur="vm.inputLeave(vm.fieldValue)" size="{{vm.size}}" ng-trim="false" class="form-control input-sm"/>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '    <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '</div>');
}]);
})();
