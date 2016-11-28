(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueFormTabs/ueFormTabs.html',
    '\n' +
    '<div class="ue-tab-wrapper">\n' +
    '    <div class="nav nav-tabs">\n' +
    '        <li data-ng-repeat="tab in vm.tabs" data-ng-class="{\'active\': vm.indexTab === $index}" data-ng-click="vm.activateTab($index)"><a href="" ng-bind="tab.label"></a></li>\n' +
    '    </div>\n' +
    '    <div class="tab-content-wrapper">\n' +
    '        <div data-ng-repeat="tab in vm.tabs" data-ng-show="vm.indexTab === $index" class="tab-item-content">\n' +
    '            <component-wrapper data-ng-repeat="field in tab.fields" data-setting="field" data-options="vm.options" data-button-class="footer"></component-wrapper>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
