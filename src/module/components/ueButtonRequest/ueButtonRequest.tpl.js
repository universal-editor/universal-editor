(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueButtonRequest/ueButtonRequest.html',
    '\n' +
    '<div>\n' +
    '    <button>{{vm.label}}</button>\n' +
    '    <!--button.btn.btn-md.btn-success(data-ng-if="vm.class == \'editor\'") {{vm.label}}-->\n' +
    '    <!--button.btn.btn-lg.btn-success(data-ng-if="vm.class == \'header\'") {{vm.label}}-->\n' +
    '    <!--button.editor-action-button(data-ng-if="vm.class == \'context\'") {{vm.label}}-->\n' +
    '</div>');
}]);
})();
