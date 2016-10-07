(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueModal/ueModal.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-click="vm.closeButton()" ng-style="{\'background-image\':\'url(\'+ vm.assetsPath +\'/images/close.jpg)\'}" class="close-editor"></div>\n' +
    '    <div ng-show="vm.header" class="ue-modal-header">\n' +
    '        <label ng-bind="vm.header.label"></label>\n' +
    '    </div>\n' +
    '    <div ng-show="vm.body" class="ue-modal-body">\n' +
    '        <div ng-bind="vm.body.text" ng-show="vm.body.text" class="text"></div>\n' +
    '        <div class="field-content-wrapper">\n' +
    '            <field-wrapper data-setting="vm.body" data-ng-if="vm.body"></field-wrapper>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div data-ng-show="vm.footer" class="ue-modal-footer">\n' +
    '        <field-wrapper data-ng-repeat="button in vm.footer track by $index" data-setting="button" class="editor-action-button"></field-wrapper>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
