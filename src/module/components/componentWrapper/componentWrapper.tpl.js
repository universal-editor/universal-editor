(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/componentWrapper/componentWrapper.html',
    '\n' +
    '<div class="component-wrapper"></div>');
}]);
})();
