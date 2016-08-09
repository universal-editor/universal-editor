(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldSelect/dropdownItems.html',
    '\n' +
    '<div data-ng-show="isOpen">\n' +
    '    <div data-ng-repeat="option in options track by $index" class="dropdown-items__item">\n' +
    '        <div class="option">\n' +
    '            <div data-ng-if="::selectBranches || !option[childCountField]" data-ng-click="onToggle($event, option)" class="option__checkbox">\n' +
    '                <div data-ng-style="{\'display\': option.checked ? \'block\' : \'\', \'background-image\':\'url(\'+ assetsPath +\'/images/checkbox_green.png)\'}" class="checkbox__check"></div>\n' +
    '            </div>\n' +
    '            <div data-ng-click="onToggle($event, option, true)" class="option__label"> <span data-ng-bind="option[fieldSearch]"></span> <span data-ng-if="option[childCountField]" data-ng-class="{\'option__child-count_open\': option.isOpen}" class="option__child-count">({{option.child_count}})</span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="option[childCountField]" data-ng-show="!!option.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">Выполняется действие</div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="option.childOpts" data-dropdown-items="" data-options="option.childOpts" data-is-open="option.isOpen" data-field-search="fieldSearch" data-child-count-field="childCountField" data-on-toggle="onToggle" data-api="api" data-select-branches="selectBranches" data-assets-path="assetsPath" class="dropdown-items__children"></div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
