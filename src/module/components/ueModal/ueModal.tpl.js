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
    '    <ue-form data-setting="$ctrl.resolve.settings" data-func-close-modal="$ctrl.close()"></ue-form>\n' +
    '</div>');
}]);
})();
