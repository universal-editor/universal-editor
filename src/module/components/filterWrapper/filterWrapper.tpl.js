(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/filterWrapper/filterWrapper.html',
    '\n' +
    '<div class="filter-wrapper"></div>');
}]);
})();
