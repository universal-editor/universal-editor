(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueButtonFilter/ueButtonFilter.html',
    '\n' +
    '<button data-ng-class="{ processing : vm.processing}" style="display: inline-block; margin: 10px;" ng-bind="vm.label" class="btn btn-lg btn-create btn-success">\n' +
    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div>\n' +
    '</button>');
}]);
})();
