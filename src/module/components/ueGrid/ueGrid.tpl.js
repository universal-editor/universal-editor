(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueGrid/ueGrid.html',
    '\n' +
    '<div>\n' +
    '    <div class="editor-header">\n' +
    '        <component-wrapper ng-if="vm.filterComponent" data-setting="vm.filterComponent" data-options="vm.optionsFields"></component-wrapper>\n' +
    '        <component-wrapper ng-repeat="button in vm.listHeaderBar track by $index" data-setting="button" data-button-class="header" class="header-action-button">       </component-wrapper>\n' +
    '    </div>\n' +
    '    <div class="groups-action">\n' +
    '        <button data-ng-if="vm.parentButton &amp;&amp; !vm.entityLoaded &amp;&amp; !vm.request.isProcessing" data-ng-click="vm.getParent()" class="btn btn-sm btn-default">{{\'BUTTON.HIGHER_LEVEL\' | translate}}</button>\n' +
    '    </div>\n' +
    '    <div data-ng-show="vm.request.isProcessing" class="processing-status-wrapper">\n' +
    '        <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <table data-ng-hide="vm.entityLoaded || vm.request.isProcessing" class="table table-bordered items-list">\n' +
    '        <thead>\n' +
    '            <tr>\n' +
    '                <td class="actions-header context-column"></td>\n' +
    '                <td data-ng-repeat="fieldItem in vm.tableFields" data-ng-class="{ \'active\' : fieldItem.field == vm.sortField, \'asc\' : vm.sortingDirection, \'desc\' : !vm.sortingDirection}" data-ng-click="vm.changeSortField(fieldItem.field)">{{fieldItem.displayName}}</td>\n' +
    '            </tr>\n' +
    '        </thead>\n' +
    '        <tbody data-ng-if="vm.listLoaded">\n' +
    '            <tr data-ng-repeat="item in vm.items" data-ng-class="{\'zhs-item\' : (vm.entityType !== item[vm.subType]) &amp;&amp; item[vm.subType] !== undefined}">\n' +
    '                <td class="context-column"><span data-ng-click="vm.toggleContextView(item[vm.idField])" data-ng-show="vm.contextLinks.length" class="context-toggle">Toggle buttons</span>\n' +
    '                    <div data-ng-show="vm.contextId == item[vm.idField]" class="context-menu-wrapper">\n' +
    '                        <div data-ng-repeat="link in vm.contextLinks track by $index" data-ng-if="(item[vm.subType] == vm.entityType || item[vm.subType] == undefined)" class="context-menu-item">\n' +
    '                            <component-wrapper data-setting="link" data-entity-id="{{item[vm.idField]}}" data-button-class="context" data-scope-id-parent="{{vm.scopeIdParent}}" data-options="vm.optionsFields"></component-wrapper>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </td>\n' +
    '                <td data-ng-repeat="fieldItem in vm.tableFields track by $index"><span data-ng-class="{\'glyphicon-folder-open icon-mix-mode\' : (vm.isMixMode &amp;&amp; !((vm.entityType !== item[vm.subType]) &amp;&amp; item[vm.subType] !== undefined))}" data-ng-if="vm.prependIcon === fieldItem.field" class="glyphicon"></span><span style="padding-left: {{ item.parentPadding ? item.parentPadding * 10 : 0 }}px;">{{item[fieldItem.field]}}</span></td>\n' +
    '            </tr>\n' +
    '            <tr data-ng-if="vm.items.length == 0">\n' +
    '                <td colspan="{{vm.tableFields.length + 1}}">{{\'ELEMENT_NO\' | translate}}</td>\n' +
    '            </tr>\n' +
    '        </tbody>\n' +
    '        <tfoot>\n' +
    '            <tr>\n' +
    '                <td colspan="{{vm.tableFields.length + 1}}">\n' +
    '                    <component-wrapper data-ng-repeat="component in vm.listFooterBar track by $index" data-setting="component" data-options="vm.optionsFields" data-scope-id-parent="{{vm.scopeIdParent}}"></component-wrapper>\n' +
    '                    <!--ue-pagination(data-data="vm.paginationData")-->\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </tfoot>\n' +
    '    </table>\n' +
    '</div>');
}]);
})();
