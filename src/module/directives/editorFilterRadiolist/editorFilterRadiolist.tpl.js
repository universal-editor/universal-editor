(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterRadiolist/editorFilterRadiolist.html',
    '\n' +
    '<div>\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <label data-ng-repeat="item in vm.selectedValues" class="radio-inline">\n' +
    '            <input type="radio" data-ng-model="vm.filterValue" value="{{item[vm.field_id]}}"/>{{item[vm.field_search]}}\n' +
    '        </label>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
