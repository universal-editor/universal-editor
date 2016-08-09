(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/fieldWrapper/fieldWrapper.html',
    '\n' +
    '<div class="field-wrapper"></div>');
}]);
})();
