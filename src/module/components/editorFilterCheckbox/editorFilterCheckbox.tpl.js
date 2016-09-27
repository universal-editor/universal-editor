(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/editorFilterCheckbox/editorFilterCheckbox.html',
    '\n' +
    '<div>\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <label data-ng-repeat="item in vm.selectedValues" class="checkbox-inline">\n' +
    '            <input type="checkbox" data-checklist-model="vm.filterValue" data-checklist-value="item[vm.field_id]"/>{{item[vm.field_search]}}\n' +
    '        </label>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
