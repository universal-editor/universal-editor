(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterSelect/editorFilterSelect.html',
    '\n' +
    '<div>\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <select ng-options="item[vm.field_id] as item[vm.field_search] for item in vm.selectedValues" data-ng-model="vm.filterValue" class="form-control">\n' +
    '            <option value="">{{vm.placeholder}}</option>\n' +
    '        </select>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
