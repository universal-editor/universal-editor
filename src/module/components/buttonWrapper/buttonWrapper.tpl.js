(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/buttonWrapper/buttonWrapper.html',
    '\n' +
    '<div class="button-wrapper"></div>');
}]);
})();
