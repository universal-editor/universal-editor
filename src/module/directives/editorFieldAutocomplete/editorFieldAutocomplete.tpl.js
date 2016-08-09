(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldAutocomplete/editorFieldAutocomplete.html',
    '\n' +
    '<div class="editor-autocomplete-wrapper">\n' +
    '    <div class="row">\n' +
    '        <div class="field-name-label col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '            <div data-ng-if="vm.hint" class="field-hint">\n' +
    '                <div class="hint-text">{{vm.hint}}</div>\n' +
    '            </div><span data-ng-class="vm.required ? \'editor-required\' : \'\' ">{{vm.fieldDisplayName}}:</span>\n' +
    '        </div>\n' +
    '        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">\n' +
    '            <div data-ng-show="vm.preloadedData" class="selected-values">\n' +
    '                <div data-ng-repeat="acItem in vm.selectedValues" class="autocomplete-item">{{acItem[vm.field_search]}}<span data-ng-click="vm.removeFromSelected(acItem)" data-ng-if="!vm.readonly" class="remove-from-selected">×</span></div>\n' +
    '            </div>\n' +
    '            <div data-ng-show="vm.preloadedData &amp;&amp; vm.selectedValues.length &lt; vm.maxItemsCount" class="autocomplete-input-wrapper">\n' +
    '                <input type="text" data-ng-hide="(!vm.multiple &amp;&amp; vm.selectedValues.length &gt;= 1)" ng-disabled="vm.readonly" data-ng-model="vm.inputValue" class="form-control input-sm"/>\n' +
    '                <div data-ng-show="vm.searching" class="loader-search-wrapper">\n' +
    '                    <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '                </div>\n' +
    '                <div data-ng-if="!vm.readonly &amp;&amp; (vm.possibleValues.length &gt; 0)" class="possible-values">\n' +
    '                    <div data-ng-repeat="possible in vm.possibleValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected(possible)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{possible[vm.field_search]}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
