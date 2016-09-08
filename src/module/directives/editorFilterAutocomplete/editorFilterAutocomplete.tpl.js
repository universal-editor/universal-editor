(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterAutocomplete/editorFilterAutocomplete.html',
    '\n' +
    '<div class="editor-autocomplete-wrapper">\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div data-ng-show="vm.preloadedData" data-ng-class="{&quot;active&quot; : vm.isActivePossible}" data-ng-click="inputFocus()" class="autocomplete-input-wrapper form-control">\n' +
    '            <input type="text" name="{{vm.filterName}}" data-ng-model="vm.inputValue" data-ng-focus="vm.focusPossible(true)" data-ng-blur="vm.focusPossible(false)" size="{{vm.sizeInput}}" data-ng-style="vm.classInput" class="autocomplete-field-search"/>\n' +
    '            <div data-ng-show="vm.preloadedData" data-ng-repeat="acItem in vm.selectedValues" class="autocomplete-item">{{acItem[vm.filter_search]}}<span data-ng-click="vm.removeFromSelected()" class="remove-from-selected">×</span></div>\n' +
    '            <div data-ng-show="vm.searching" class="loader-search-wrapper">\n' +
    '                <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="vm.possibleValues.length &gt; 0" data-ng-class="{&quot;active&quot; : vm.isActivePossible}" class="possible-values possible-autocomplete">\n' +
    '                <div class="possible-scroll">\n' +
    '                    <div data-ng-repeat="possible in vm.possibleValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected(possible)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{possible[vm.filter_search]}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
