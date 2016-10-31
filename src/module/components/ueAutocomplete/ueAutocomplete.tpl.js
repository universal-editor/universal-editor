(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueAutocomplete/ueAutocomplete.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.options.filter, \'filter-inner-wrapper\': vm.options.filter}">\n' +
    '    <label ng-if="!vm.options.filter" class="field-name-label">\n' +
    '        <div data-ng-if="vm.hint" class="field-hint">\n' +
    '            <div ng-bind="vm.hint" class="hint-text"></div>\n' +
    '        </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>\n' +
    '    </label>\n' +
    '    <div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}" ng-style="{\'overflow:auto\':vm.multiple}"> \n' +
    '        <div data-ng-show="vm.preloadedData &amp;&amp; vm.selectedValues.length &lt; vm.maxItemsCount" data-ng-class="{&quot;active&quot; : vm.isActivePossible}" data-ng-click="inputFocus()" class="autocomplete-input-wrapper form-control">\n' +
    '            <div data-ng-repeat="acItem in vm.selectedValues" data-ng-show="vm.preloadedData" data-ng-if="vm.multiple" class="autocomplete-item">{{acItem[vm.field_search]}}<span data-ng-click="vm.removeFromSelected($event, acItem)" data-ng-if="!vm.readonly" class="remove-from-selected">×</span></div>\n' +
    '            <input type="text" ng-disabled="vm.readonly" data-ng-model="vm.inputValue" data-ng-focus="vm.focusPossible(true)" data-ng-blur="vm.focusPossible(false)" size="{{vm.sizeInput}}" data-ng-style="vm.classInput" data-ng-keydown="vm.deleteToAutocomplete($event)" placeholder="{{vm.placeholder}}" data-ng-class="!vm.isActivePossible ? &quot;color-placeholder&quot; : &quot;&quot;" class="autocomplete-field-search"/><span data-ng-if="!vm.multiple &amp;&amp; !!vm.selectedValues.length" data-ng-click="vm.removeFromSelected($event, vm.selectedValues[0])" class="selecte-delete selecte-delete-autocomplete">×</span>\n' +
    '            <div data-ng-show="vm.searching" class="loader-search-wrapper">\n' +
    '                <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.readonly &amp;&amp; (vm.possibleValues.length &gt; 0) &amp;&amp; vm.showPossible" class="possible-values possible-autocomplete active possible-bottom">\n' +
    '                <div class="possible-scroll">\n' +
    '                    <div data-ng-repeat="possible in vm.possibleValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected($event, possible)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{possible[vm.field_search]}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '    <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '</div>');
}]);
})();
