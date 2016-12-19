(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/template/templatesForComponents/temp.html',
    '\n' +
    '<button data-ng-click="lockTrigger($event)" class="lock">Локер</button>');
}]);
})();
