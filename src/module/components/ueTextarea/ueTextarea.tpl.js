(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueTextarea/ueTextarea.html',
    '\n' +
    '<div ng-if="!vm.filter" class="field-wrapper row">\n' +
    '    <div class="form-group">\n' +
    '        <label class="field-name-label">\n' +
    '            <div data-ng-if="vm.hint" class="field-hint">\n' +
    '                <div class="hint-text">{{vm.hint}}</div>\n' +
    '            </div><span data-ng-class="vm.required ? \'editor-required\' : \'\' ">{{vm.fieldDisplayName}}:</span>\n' +
    '        </label>\n' +
    '        <div class="field-element">\n' +
    '            <div data-ng-if="vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '                <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-textarea-wrapper">\n' +
    '                    <textarea name="{{vm.fieldName}}" rows="{{vm.rows}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue[$index]" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" class="form-control editor-textarea"></textarea>\n' +
    '                    <div data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</div>\n' +
    '                </div>\n' +
    '                <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '                <textarea name="{{vm.fieldName}}" rows="{{vm.rows}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" data-ng-blur="vm.inputLeave(vm.fieldValue)" class="form-control editor-textarea"></textarea>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-if="vm.filter" class="filter-wrapper-field">\n' +
    '    <div class="filter-name-label"><span>{{vm.fieldDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <input type="text" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
