(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/disabledField/colorpicker.html',
    '\n' +
    '<div>\n' +
    '    <div ng-if="!vm.multiple" ng-style="{ \'background-color\': vm.fieldValue}" class="disabled-colorpicker"></div>\n' +
    '    <div ng-if="vm.multiple" ng-repeat="value in vm.fieldValue track by $index" ng-style="{ \'background-color\': value}" class="disabled-colorpicker"></div>\n' +
    '</div>');
}]);
})();
