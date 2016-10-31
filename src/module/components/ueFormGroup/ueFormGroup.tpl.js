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
    '    <div class="field-array-wrapper col-md-12 col-xs-12 col-sm-12 col-lg-12">\n' +
    '        <div data-ng-if="vm.multiple">\n' +
    '            <div data-ng-repeat="fields in vm.fieldsArray track by $index" data-ng-init="outerIndex = $index" class="item-array-wrapper">\n' +
    '                <data-component-wrapper ng-class="vm.className" data-ng-repeat="field in fields" data-setting="field" data-options="vm.options"></data-component-wrapper>\n' +
    '                <div class="col-md-12 col-xs-12 col-lg-12 col-sm-12">\n' +
    '                    <div data-ng-click="vm.removeItem(outerIndex)" data-ng-if="!vm.readonly" style="margin: 10px 15px 0 15px; float: right;" class="btn btn-primary btn-xs">{{\'BUTTON.DELETE\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="col-md-12 col-xs-12 col-lg-12 col-sm-12">\n' +
    '                <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple">\n' +
    '            <data-component-wrapper ng-class="vm.className" data-ng-repeat="field in vm.innerFields" data-setting="field" data-options="vm.options"></data-component-wrapper>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
