(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueFilter/ueFilter.html',
    '\n' +
    '<div class="filter-component">\n' +
    '    <button data-ng-click="vm.toggleFilterVisibility()" class="btn btn-lg btn-default glyphicon glyphicon-filter filter-button"> </button>\n' +
    '    <div data-ng-hide="!vm.visiable" class="editor-filter">\n' +
    '        <div ng-keyup="vm.clickEnter($event)" class="editor-filter-wrapper">\n' +
    '            <div class="editor-filter-body">\n' +
    '                <div ng-repeat="group in vm.body track by $index" class="filter-content-wrapper">\n' +
    '                    <label ng-bind="group.label" title="{{group.label}}" class="filter-name-label"></label>\n' +
    '                    <component-wrapper ng-repeat="filter in group.filters" data-setting="filter.field" data-options="filter.options" style="{{filter.ngStyle}}"></component-wrapper>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="editor-filter-footer">\n' +
    '                <component-wrapper data-ng-repeat="button in vm.footer track by $index" data-setting="button" data-options="vm.options" data-button-class="header"></component-wrapper>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
