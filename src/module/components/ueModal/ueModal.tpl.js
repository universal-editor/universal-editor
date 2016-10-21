(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueModal/ueModal.html',
    '\n' +
    '<div style="background: #ebf1f3;">\n' +
    '    <div data-ng-click="vm.cancel()" style="display: block; position: absolute; top: 22px; right: 22px; width: 13px; height: 13px; cursor: pointer;" ng-style="{\'background-image\':\'url(\'+ vm.assetsPath +\'/images/close.jpg)\'}" class="close-editor"></div>\n' +
    '    <div ng-show="vm.header" style="padding: 10px;" class="ue-modal-header">\n' +
    '        <label ng-bind="vm.header.label"></label>\n' +
    '    </div>\n' +
    '    <div ng-show="vm.body" class="ue-modal-body">\n' +
    '        <div ng-bind="vm.body.text" ng-show="vm.body.text" class="text"></div>\n' +
    '        <div class="field-content-wrapper">\n' +
    '            <component-wrapper data-setting="vm.body" data-ng-if="vm.body" data-options="vm.options"></component-wrapper>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div data-ng-show="vm.footer" class="ue-modal-footer">\n' +
    '        <component-wrapper data-ng-repeat="button in vm.footer track by $index" data-setting="button" data-options="vm.options" class="editor-action-button"></component-wrapper>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
