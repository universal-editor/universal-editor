(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueButtonDelete/ueButtonDelete.html',
    '\n' +
    '<div>\n' +
    '    <button data-ng-class="{ processing : vm.processing}" data-ng-if="vm.buttonClass == \'editor\'" class="btn btn-md btn-success">{{vm.label}}\n' +
    '        <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '            <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </button>\n' +
    '    <button data-ng-if="vm.buttonClass == \'context\'" class="editor-action-button">{{vm.label}}</button>\n' +
    '</div>');
}]);
})();
