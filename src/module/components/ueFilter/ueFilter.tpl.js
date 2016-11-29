(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueFilter/ueFilter.html',
    '\n' +
    '<div style="margin: 10px 5px;">\n' +
    '    <button data-ng-click="vm.toggleFilterVisibility()" class="btn btn-lg btn-default filter-button">Фильтр {{vm.visiable ? \'-\' : \'+\'}}</button>\n' +
    '    <div data-ng-hide="!vm.visiable" class="editor-filter">\n' +
    '        <div ng-keyup="vm.clickEnter($event)" class="editor-filter-wrapper">\n' +
    '            <div class="editor-filter-head">\n' +
    '                <label ng-bind="vm.header.label"></label>\n' +
    '            </div>\n' +
    '            <div style="padding: 5px 15px;" class="editor-filter-body">\n' +
    '                <div ng-repeat="group in vm.body track by $index" class="filter-content-wrapper">\n' +
    '                    <label class="filter-name-label"> <span ng-bind="group.label"></span></label>\n' +
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
