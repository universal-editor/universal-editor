(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueColorpicker/ueColorpicker.html',
    '\n' +
    '<div ng-if="!vm.filter" class="field-wrapper row">\n' +
    '    <div class="form-group">\n' +
    '        <label class="field-name-label">\n' +
    '            <div data-ng-if="vm.hint" class="field-hint">\n' +
    '                <div class="hint-text">{{vm.hint}}</div>\n' +
    '            </div><span data-ng-class="vm.required ? \'editor-required\' : \'\' ">{{vm.fieldDisplayName}}:</span>\n' +
    '        </label>\n' +
    '        <div class="field-element">\n' +
    '            <div data-ng-if="vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '                <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-colorpicker-wrapper input-group">\n' +
    '                    <input type="text" data-ng-disabled="vm.readonly" data-minicolors="" data-ng-model="vm.fieldValue[$index]" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                        <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '                </div>\n' +
    '                <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '                <input type="text" data-ng-disabled="vm.readonly" data-minicolors="" data-ng-model="vm.fieldValue" class="form-control input-sm"/>\n' +
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
    '        <input type="text" data-minicolors="" data-ng-model="vm.fieldValue" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
