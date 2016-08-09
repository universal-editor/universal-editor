(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonCreate/editorButtonCreate.html',
    '\n' +
    '<button class="btn btn-lg btn-success">{{vm.label}}</button>');
}]);
})();
