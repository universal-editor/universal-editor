(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueDropdown/dropdownItems.html',
    '\n' +
    '<div data-ng-show="isOpen">\n' +
    '    <div data-ng-class="{&quot;dropdown-scroll&quot; : (lvlDropdown == 1)}">\n' +
    '        <div data-ng-repeat="option in options track by $index" data-ng-class="activeElement == $index ? \'active\' : \'\'" data-ng-mouseover="setActiveElement($event, $index)" class="dropdown-items__item">\n' +
    '            <div class="option">\n' +
    '                <div data-ng-if="::selectBranches || !option[childCountField]" data-ng-mousedown="onToggle($event, option)" data-ng-class="{&quot;multi_radio&quot; : !multiple}" class="option__checkbox">\n' +
    '                    <div data-ng-style="{\'display\': option.checked ? \'block\' : \'\', \'background-image\':\'url(\'+ assetsPath + (!multiple ? \'/images/radio_green.png)\' : \'/images/checkbox_green.png)\')}" data-ng-class="{&quot;multi_radio&quot; : !multiple}" class="checkbox__check"></div>\n' +
    '                </div>\n' +
    '                <div data-ng-mousedown="onToggle($event, option, true)" class="option__label"><span data-ng-bind="option[fieldSearch]"></span> <span data-ng-if="option[childCountField]" data-ng-class="{\'option__child-count_open\': option.isOpen}" class="option__child-count">({{option[childCountField]}})</span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="option[childCountField]" data-ng-show="!!option.loadingData" class="processing-status-wrapper">\n' +
    '                <div class="processing-status">Выполняется действие</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="option.childOpts" data-dropdown-items="" data-options="option.childOpts" data-is-open="option.isOpen" data-field-search="fieldSearch" data-child-count-field="childCountField" data-on-toggle="onToggle" data-api="api" data-select-branches="selectBranches" data-assets-path="assetsPath" data-multiple="multiple" data-active-element="activeElement" data-set-active-element="setActiveElement" data-lvl-dropdown="lvlDropdown + 1" class="dropdown-items__children"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
