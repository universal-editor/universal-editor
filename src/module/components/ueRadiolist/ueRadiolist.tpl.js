(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueRadiolist/ueRadiolist.html',
    '\n' +
    '<div ng-if="!vm.filter" class="field-wrapper row">\n' +
    '    <div class="form-group">\n' +
    '        <label class="field-name-label">\n' +
    '            <div data-ng-if="vm.hint" class="field-hint">\n' +
    '                <div class="hint-text">{{vm.hint}}</div>\n' +
    '            </div><span data-ng-class="vm.required ? \'editor-required\' : \'\' ">{{vm.fieldDisplayName}}:</span>\n' +
    '        </label>\n' +
    '        <div class="field-element">\n' +
    '            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '                <div data-ng-repeat="item in vm.selectedValues" data-ng-class="vm.readonly ? \'disabled\' : \'\'" class="radio">\n' +
    '                    <label>\n' +
    '                        <input type="radio" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" value="{{item[vm.field_id]}}"/><span ng-bind="item[vm.field_search]"></span>\n' +
    '                    </label>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-if="vm.filter">\n' +
    '    <div class="filter-name-label"><span ng-bind="vm.fieldDisplayName"></span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <label data-ng-repeat="item in vm.selectedValues" class="radio-inline">\n' +
    '            <input type="radio" data-ng-model="vm.fieldValue" value="{{item[vm.field_id]}}"/><span ng-bind="item[vm.field_search]"></span>\n' +
    '        </label>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
