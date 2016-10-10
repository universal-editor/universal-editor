(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueForm/ueForm.html',
    '\n' +
    '<div class="editor-body">\n' +
    '    <div data-ng-click="vm.closeButton()" ng-style="{\'background-image\':\'url(\'+ vm.assetsPath +\'/images/close.jpg)\'}" data-ng-if="!vm.isButtonClose" class="close-editor"></div>\n' +
    '    <div class="nav nav-tabs">\n' +
    '        <li data-ng-repeat="tab in vm.tabs" data-ng-class="vm.currentTab == tab.label ? \'active\' : \'\'" data-ng-click="vm.currentTab = tab.label"><a href="">{{tab.label}}</a></li>\n' +
    '    </div>\n' +
    '    <div class="tab-content-wrapper">\n' +
    '        <div data-ng-repeat="tab in vm.tabs" data-ng-show="vm.currentTab == tab.label" class="tab-item-content">\n' +
    '            <div class="field-content-wrapper">\n' +
    '                <component-wrapper data-ng-repeat="field in tab.fields" data-setting="field" data-button-class="footer"></component-wrapper>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="field-error-bottom-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.errors" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '    <div class="field-notify-bottom-wrapper">\n' +
    '        <div data-ng-repeat="notify in vm.notifys" class="notify-item">{{notify}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="vm.entityLoaded" class="editor-entity-actions">\n' +
    '        <component-wrapper data-ng-repeat="button in vm.editFooterBar track by $index" data-entity-id="{{vm.entityId}}" data-setting="button" data-button-class="footer" class="editor-action-button"></component-wrapper>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
