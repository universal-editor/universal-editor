(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/disabledField/checkBox.html',
    '\n' +
    '<div>\n' +
    '    <div ng-repeat="value in vm.previewValue track by $index" data-ng-show="!vm.loadingData"><span ng-bind="value"></span></div>\n' +
    '</div>');
}]);
})();
