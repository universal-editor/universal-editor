(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueButtonTargetBlank/ueButtonTargetBlank.html',
    '\n' +
    '<div>\n' +
    '    <button data-ng-if="vm.setting.buttonClass == \'footer\'" class="btn btn-md btn-success">{{vm.label}}</button>\n' +
    '    <button data-ng-if="vm.setting.buttonClass == \'header\'" class="btn btn-lg btn-success">{{vm.label}}</button>\n' +
    '    <button data-ng-if="vm.setting.buttonClass == \'context\'" class="editor-action-button">{{vm.label}}</button>\n' +
    '</div>');
}]);
})();
