(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldTextarea/editorFieldTextarea.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-textarea-wrapper">\n' +
    '            <div>\n' +
    '                <textarea name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue[$index]" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" class="form-control editor-textarea"></textarea>\n' +
    '                <div data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '        <div>\n' +
    '            <textarea name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" data-ng-blur="vm.inputLeave(vm.fieldValue)" class="form-control editor-textarea"></textarea>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
