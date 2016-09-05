(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterSelect/editorFilterSelect.html',
    '\n' +
    '<div>\n' +
    '    <div class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div data-ng-click="vm.isShowPossible($event)" data-ng-class="!vm.search ? &quot;but-for-search&quot; : &quot;&quot;" class="select-input-wrapper">\n' +
    '            <input data-ng-if="vm.search" placeholder="{{vm.placeholder}}" data-ng-class="vm.isSelection ? &quot;color-placeholder&quot; : &quot;&quot;" data-ng-model="vm.filterText" data-ng-change="vm.change()" data-ng-focus="vm.focusPossible(true)" data-ng-blur="vm.focusPossible(false)" class="form-control"/>\n' +
    '            <div data-ng-if="!vm.search" data-ng-focus="vm.focusPossible(true)" class="form-control select-input">\n' +
    '                <div data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;" class="dropdown__selected-items">{{vm.placeholder}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.readonly &amp;&amp; (vm.selectedValues.length &gt; 0) &amp;&amp; vm.showPossible" data-ng-class="{&quot;active&quot; : vm.isActivePossible}" class="possible-values">\n' +
    '                <div data-ng-repeat="option in vm.selectedValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected(option)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{option[vm.field_search]}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
