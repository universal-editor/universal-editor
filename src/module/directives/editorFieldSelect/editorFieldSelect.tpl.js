(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldSelect/editorFieldSelect.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple &amp;&amp; !vm.isTree" class="col-lg-2 col-md-2 col-sm-2 col-xs-2">\n' +
    '        <select name="{{vm.fieldName}}" data-ng-disabled="vm.readonly || !vm.parentValue" data-ng-model="vm.fieldValue" multiple="multiple" class="form-control">\n' +
    '            <option data-ng-repeat="option in vm.options" value="{{option[vm.field_id]}}">{{option[vm.field_search]}}</option>\n' +
    '        </select>\n' +
    '        <div data-ng-show="!!vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple &amp;&amp; !vm.isTree" class="col-lg-2 col-md-2 col-sm-2 col-xs-2">\n' +
    '        <select name="{{vm.fieldName}}" data-ng-disabled="vm.readonly || !vm.parentValue" data-ng-model="vm.fieldValue" ng-options="option[vm.field_search] for option in vm.options track by option[vm.field_id]" class="form-control">\n' +
    '            <option value="" data-ng-show="!vm.required &amp;&amp; !vm.loadingData">{{vm.placeholder}}</option>\n' +
    '        </select>\n' +
    '        <div data-ng-show="!!vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="vm.isTree" class="dropdown col-lg-3 col-md-3 col-sm-3 col-xs-3">\n' +
    '        <div class="dropdown__host">\n' +
    '            <div data-ng-class="{\'dropdown__title_open\': isOpen}" data-ng-click="toggleDropdown($event)" data-ng-style="{&quot;cursor&quot; : vm.search ? &quot;text&quot; : &quot;pointer&quot;}" class="dropdown__title form-control">\n' +
    '                <div data-ng-repeat="value in vm.fieldValue" data-ng-if="vm.fieldValue.length &amp;&amp; (vm.multiple || vm.treeParentField &amp;&amp; vm.treeChildCountField)" class="selected-items__item">\n' +
    '                    <div class="selected-item">{{value[vm.field_search]}}<span data-ng-click="vm.remove($event, value)" class="selected-item__btn_delete">x</span></div>\n' +
    '                </div>\n' +
    '                <input data-ng-show="vm.search" data-ng-model="vm.filterText" data-ng-focus="vm.focus($event)" data-ng-change="vm.change()" data-ng-click="vm.focus($event)" placeholder="{{vm.placeholder}}" ng-keyup="vm.clickEsc($event)" data-ng-style="vm.styleInput" size="{{vm.sizeInput}}" class="dropdown__search-field"/>\n' +
    '                <div data-ng-if="!vm.search">\n' +
    '                    <div data-ng-if="!vm.loadingData &amp;&amp; !vm.fieldValue.length" class="dropdown__selected-items">{{vm.placeholder}}</div>\n' +
    '                </div>\n' +
    '                <div data-ng-if="::(vm.treeParentField &amp;&amp; vm.treeChildCountField)" data-ng-class="{\'dropdown__items_with-selected\': vm.fieldValue.length &gt; 2 || (vm.search &amp;&amp; vm.fieldValue.length)}" data-dropdown-items="" data-options="vm.options" data-is-open="isOpen &amp;&amp; vm.options.length" data-field-search="vm.field_search" data-child-count-field="vm.treeChildCountField" data-on-toggle="vm.toggle" data-api="field.values_remote.api" data-select-branches="vm.treeSelectBranches" data-assets-path="vm.assetsPath" data-multiple="vm.multiple" class="dropdown__items dropdown__items_with-padding"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-show="!!vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
