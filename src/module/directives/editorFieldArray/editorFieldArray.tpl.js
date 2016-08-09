(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldArray/editorFieldArray.html',
    '\n' +
    '<div class="editor-field-array">\n' +
    '    <div class="field-name-label label-array">\n' +
    '        <div data-ng-if="vm.hint" class="field-hint">\n' +
    '            <div class="hint-text">{{vm.hint}}</div>\n' +
    '        </div>{{vm.fieldDisplayName}}\n' +
    '    </div>\n' +
    '    <div class="field-array-wrapper">\n' +
    '        <div data-ng-if="vm.multiple">\n' +
    '            <div data-ng-repeat="array in vm.fieldsArray track by $index" data-ng-init="outerIndex = $index" class="item-array-wrapper">\n' +
    '                <div data-ng-repeat="field in vm.innerFields" data-field-wrapper="" data-field-name="{{field.name}}" data-parent-field="{{vm.fieldName}}" data-parent-field-index="{{outerIndex}}"></div>\n' +
    '                <div class="row">\n' +
    '                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-lg-offset-6 col-md-offset-6 col-sm-offset-6 col-xs-offset-6">\n' +
    '                        <div data-ng-click="vm.removeItem(outerIndex)" data-ng-if="!vm.readonly" class="btn btn-primary btn-xs">{{\'BUTTON.DELETE\' | translate}}</div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="row">\n' +
    '                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-lg-offset-6 col-md-offset-6 col-sm-offset-6 col-xs-offset-6">\n' +
    '                    <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple">\n' +
    '            <div data-ng-repeat="field in vm.innerFields" data-field-wrapper="" data-field-name="{{field.name}}" data-parent-field="{{vm.fieldName}}"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
