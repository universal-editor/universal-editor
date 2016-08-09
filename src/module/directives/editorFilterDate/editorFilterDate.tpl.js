(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterDate/editorFilterDate.html',
    '\n' +
    '<div class="filter-date-wrapper">\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div class="filter-start">\n' +
    '            <div class="editor-date">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueStartDate" data-format="YYYY-MM-DD" data-max-view="year" data-min-view="date" data-view="date" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '            <div class="editor-time">\n' +
    '                <input data-ng-disabled="!vm.filterValueStartDate" data-date-time="" data-ng-model="vm.filterValueStartTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div><span class="divider">-</span>\n' +
    '        <div class="filter-end">\n' +
    '            <div class="editor-date">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueEndDate" data-format="YYYY-MM-DD" data-max-view="year" data-min-view="date" data-view="date" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '            <div class="editor-time">\n' +
    '                <input data-ng-disabled="!vm.filterValueEndDate" data-date-time="" data-ng-model="vm.filterValueEndTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
