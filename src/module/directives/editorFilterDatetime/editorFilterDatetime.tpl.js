(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterDatetime/editorFilterDatetime.html',
    '\n' +
    '<div class="filter-datetime-wrapper">\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div class="filter-start">\n' +
    '            <div class="editor-datetime">\n' +
    '                <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.filterValueStartDateTime" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div><span class="divider">-</span>\n' +
    '        <div class="filter-end">\n' +
    '            <div class="editor-datetime">\n' +
    '                <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.filterValueEndDateTime" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
