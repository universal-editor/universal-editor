(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueButtonOpen/ueButtonOpen.html',
    '\n' +
    '<button data-ng-class="{ processing : vm.processing}" class="editor-action-button">{{vm.label}}\n' +
    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div>\n' +
    '</button>');
}]);
})();
