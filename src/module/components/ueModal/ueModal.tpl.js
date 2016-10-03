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
    '    <ue-form data-setting="$ctrl.resolve.setting"></ue-form>\n' +
    '    <!--.modal-footer\n' +
    '    button.btn.btn-primary(ng-click="$ctrl.ok()") OK\n' +
    '    button.btn.btn-warning(ng-click="$ctrl.cancel()") Cancel\n' +
    '    -->\n' +
    '</div>');
}]);
})();
