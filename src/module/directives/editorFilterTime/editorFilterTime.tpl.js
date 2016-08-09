(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterTime/editorFilterTime.html',
    '\n' +
    '<div class="filter-time-wrapper">\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div class="filter-start">\n' +
    '            <div class="editor-time">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueStartTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div><span class="divider">-</span>\n' +
    '        <div class="filter-end">\n' +
    '            <div class="editor-time">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueEndTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
