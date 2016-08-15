(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldWysiwyg/editorFieldWysiwyg.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="field-textarea-wrapper col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-textarea-wrapper">\n' +
    '            <div>\n' +
    '                <textarea data-ui-tinymce="vm.wysiwygOptions" data-ng-model="vm.fieldValue[$index]"></textarea>\n' +
    '                <div data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="field-textarea-wrapper col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '        <div>\n' +
    '            <textarea data-ui-tinymce="vm.wysiwygOptions" data-ng-model="vm.fieldValue"></textarea>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
