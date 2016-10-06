(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueButtonCreate/ueButtonCreate.html',
    '\n' +
    '<button class="btn btn-lg btn-create btn-success">{{vm.label}}</button>');
}]);
})();
