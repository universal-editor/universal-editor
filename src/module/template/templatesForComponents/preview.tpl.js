(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/templatesForComponents/preview.html',
    '\n' +
    '<div class="component-preview"> \n' +
    '    <div data-ng-show="vm.loadingData" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div><span ng-bind="vm.previewValue" data-ng-show="!vm.loadingData" ng-if="!vm.multiple"></span>\n' +
    '    <div ng-repeat="value in vm.previewValue track by $index" data-ng-show="!vm.loadingData" ng-if="vm.multiple"><span ng-bind="value"></span></div>\n' +
    '</div>');
}]);
})();
