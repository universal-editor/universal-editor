(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueSelect/ueSelect.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.options.filter, \'filter-wrapper-field\': vm.options.filter}" class="field-wrapper-ue-select">\n' +
    '    <label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">\n' +
    '        <div data-ng-if="!!vm.hint" class="field-hint">\n' +
    '            <div ng-bind="vm.hint" class="hint-text"></div>\n' +
    '        </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>\n' +
    '    </label>\n' +
    '    <div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}" ng-style="{\'overflow:auto\': vm.multiple}">\n' +
    '        <div data-ng-if="vm.multiple &amp;&amp; !vm.isTree">\n' +
    '            <div class="select-border">\n' +
    '                <select name="{{vm.fieldName}}" data-ng-disabled="vm.readonly || !vm.parentValue" data-ng-model="vm.fieldValue" multiple="multiple" size="3" class="form-control">\n' +
    '                    <option data-ng-repeat="option in vm.optionValues" value="{{option[vm.field_id]}}">{{option[vm.field_search]}}</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div data-ng-show="!!vm.loadingData" style="position: absolute; margin: -28px 0 0 20px;" class="processing-status-wrapper">\n' +
    '                <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple &amp;&amp; !vm.isTree">\n' +
    '            <div data-ng-click="vm.clickSelect()" data-ng-class="!vm.search ? &quot;but-for-search&quot; : &quot;&quot;" class="select-input-wrapper">\n' +
    '                <input data-ng-if="vm.search" ng-disabled="vm.loadingData" placeholder="{{vm.placeholder}}" data-ng-class="vm.isSelection ? &quot;color-placeholder&quot; : &quot;&quot;" data-ng-model="vm.filterText" data-ng-change="vm.change()" data-ng-focus="vm.isShowPossible()" data-ng-blur="vm.isBlur()" class="form-control select-input"/>\n' +
    '                <input data-ng-if="!vm.search" data-ng-focus="vm.isShowPossible()" data-ng-blur="vm.isBlur()" class="focus-input"/>\n' +
    '                <div data-ng-if="!vm.search" class="form-control select-input">\n' +
    '                    <div data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;" class="dropdown__selected-items">{{vm.placeholder}}</div>\n' +
    '                </div><span data-ng-if="vm.isSpanSelectDelete" data-ng-click="vm.deleteToSelected($event, false)" class="selecte-delete">×</span>\n' +
    '                <div data-ng-if="!vm.readonly &amp;&amp; (vm.optionValues.length &gt; 0) &amp;&amp; vm.showPossible" data-ng-class="vm.possibleLocation ? &quot;possible-bottom&quot; : &quot;possible-top&quot;" class="possible-values active">\n' +
    '                    <div class="possible-scroll">\n' +
    '                        <div data-ng-repeat="option in vm.optionValues" data-ng-mouseover="vm.activeElement = $index" data-ng-mousedown="vm.addToSelected($event, option)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{option[vm.field_search]}}</div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div data-ng-show="vm.loadingData" style="position: absolute; margin: -28px 0 0 20px;" class="processing-status-wrapper">\n' +
    '                <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="vm.isTree" class="dropdown">\n' +
    '            <div class="dropdown__host">\n' +
    '                <div data-ng-class="{\'dropdown__title_open\': isOpen}" data-ng-click="vm.clickSelect()" data-ng-style="{&quot;cursor&quot; : vm.search &amp;&amp; !vm.loadingData ? &quot;text&quot; : &quot;pointer&quot;}" class="dropdown__title form-control select-input">\n' +
    '                    <div data-ng-repeat="value in vm.fieldValue" data-ng-if="vm.fieldValue.length &amp;&amp; vm.multiple &amp;&amp; value[vm.field_search]" class="selected-items__item">\n' +
    '                        <div class="selected-item">\n' +
    '                            <label ng-bind="value[vm.field_search]" style="overflow: hidden; text-overflow: ellipsis; margin-right: 15px; display: block;"></label><span data-ng-click="vm.remove($event, value)" style="float: right; width: 10px; margin-top: -24px;" class="selected-item__btn_delete">×</span>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <input data-ng-if="vm.search" ng-disabled="vm.loadingData" data-ng-model="vm.filterText" data-ng-change="vm.change()" placeholder="{{vm.placeholder}}" data-ng-style="vm.styleInput" size="{{vm.sizeInput}}" data-ng-focus="toggleDropdown()" data-ng-blur="vm.isBlur()" data-ng-keydown="vm.deleteToSelected($event, true)" data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder&quot; : &quot;&quot;" class="dropdown__search-field"/>\n' +
    '                    <input data-ng-if="!vm.search" data-ng-focus="toggleDropdown()" data-ng-blur="vm.isBlur()" class="focus-input"/>\n' +
    '                    <div data-ng-if="!vm.search" class="dropdown__selected">\n' +
    '                        <div data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;" data-ng-if="!vm.loadingData" class="dropdown__selected-items dropdown-tree">{{vm.placeholder}}</div>\n' +
    '                    </div><span data-ng-if="vm.isSpanSelectDelete" data-ng-click="vm.deleteToSelected($event, false)" class="selecte-delete">×</span>\n' +
    '                    <div data-ng-if="::(vm.treeParentField &amp;&amp; vm.treeChildCountField)" data-ng-class="{\'dropdown__items_with-selected\': vm.fieldValue.length &gt; 2 || (vm.search &amp;&amp; vm.fieldValue.length)}" data-dropdown-items="" data-options="vm.optionValues" data-is-open="isOpen &amp;&amp; vm.optionValues.length" data-field-search="vm.field_search" data-child-count-field="vm.treeChildCountField" data-on-toggle="vm.toggle" data-api="vm.field.values_remote.url" data-select-branches="vm.treeSelectBranches" data-assets-path="vm.assetsPath" data-multiple="vm.multiple" data-active-element="vm.activeElement" data-set-active-element="vm.setActiveElement" data-lvl-dropdown="1" class="dropdown__items dropdown__items_with-padding active dropdown-bottom"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div data-ng-show="vm.loadingData" style="position: absolute; margin: -28px 0 0 20px;" class="processing-status-wrapper">\n' +
    '                <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '<div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '    <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '</div>');
}]);
})();
