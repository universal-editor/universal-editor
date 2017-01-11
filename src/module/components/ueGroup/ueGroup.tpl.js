(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueGroup/ueGroup.html',
    '\n' +
    '<div class="editor-field-array">\n' +
    '    <label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">\n' +
    '        <div data-ng-if="!!vm.hint" class="field-hint">\n' +
    '            <div ng-bind="::vm.hint" class="hint-text"></div>\n' +
    '        </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="::vm.label"></span>\n' +
    '    </label>\n' +
    '    <div class="field-array-wrapper editor-group col-md-12 col-xs-12 col-sm-12 col-lg-12">\n' +
    '        <div data-ng-if="vm.multiple">\n' +
    '            <div data-ng-repeat="fields in vm.fieldsArray track by $index" data-ng-init="outerIndex = $index" class="item-array-wrapper">\n' +
    '                <data-component-wrapper ng-class="vm.className" data-ng-repeat="field in fields" data-setting="field" data-options="vm.options"></data-component-wrapper>\n' +
    '                <div class="col-md-12 col-xs-12 col-lg-12 col-sm-12">\n' +
    '                    <div data-ng-click="vm.removeItem(outerIndex)" data-ng-if="!vm.readonly" class="btn btn-primary btn-xs">{{\'BUTTON.DELETE\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="col-md-12 col-xs-12 col-lg-12 col-sm-12">\n' +
    '                <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple">\n' +
    '            <data-component-wrapper ng-class="vm.className" data-ng-repeat="field in vm.innerFields" data-setting="field" data-options="vm.option"></data-component-wrapper>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
