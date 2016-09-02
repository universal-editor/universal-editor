(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldAutocomplete/editorFieldAutocomplete.html',
    '\n' +
    '<div>\n' +
    '    <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <div data-ng-show="vm.preloadedData" class="selected-values">\n' +
    '            <div data-ng-repeat="acItem in vm.selectedValues" class="autocomplete-item">{{acItem[vm.field_search]}}<span data-ng-click="vm.removeFromSelected(acItem)" data-ng-if="!vm.readonly" class="remove-from-selected">×</span></div>\n' +
    '        </div>\n' +
    '        <div data-ng-show="vm.preloadedData &amp;&amp; vm.selectedValues.length &lt; vm.maxItemsCount" class="autocomplete-input-wrapper">\n' +
    '            <input type="text" data-ng-hide="(!vm.multiple &amp;&amp; vm.selectedValues.length &gt;= 1)" ng-disabled="vm.readonly" data-ng-model="vm.inputValue" data-ng-focus="vm.focusPossible(true)" data-ng-blur="vm.focusPossible(false)" class="form-control input-sm"/>\n' +
    '            <div data-ng-show="vm.searching" class="loader-search-wrapper">\n' +
    '                <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.readonly &amp;&amp; (vm.possibleValues.length &gt; 0)" data-ng-class="{&quot;active&quot; : vm.isActivePossible}" class="possible-values">\n' +
    '                <div data-ng-repeat="possible in vm.possibleValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected(possible)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{possible[vm.field_search]}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
