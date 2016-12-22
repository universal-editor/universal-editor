(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueButtonRequest/ueButtonRequest.html',
    '\n' +
    '<button data-ng-class="vm.classButton" data-ng-click="vm.buttonClick()">{{::vm.label}}</button>');
}]);
})();
