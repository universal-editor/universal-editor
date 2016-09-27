(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/editorFilterString/editorFilterString.html',
    '\n' +
    '<div>\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <input type="text" name="{{vm.filterName}}" data-ng-model="vm.filterValue" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
