(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/universalEditor/universalEditorList.html',
    '\n' +
    '<ul data-ng-if="vm.configData.entities.length &gt; 1" class="nav nav-tabs">\n' +
    '    <li data-ng-repeat="entityItem in vm.configData.entities track by $index" data-ng-class="(entityItem.name === entity) ? \'active\' : \'\'" class="item"><a data-ui-sref="editor.type.list({type: entityItem.name})" ui-sref-opts="{reload: true, inherit: false}">{{entityItem.label}}</a></li>\n' +
    '</ul>\n' +
    '<div class="universal-editor">\n' +
    '    <div>\n' +
    '        <div class="editor-header">\n' +
    '            <button data-ng-click="vm.toggleFilterVisibility()" data-ng-class="{ disabled : vm.entityLoaded }" class="btn btn-lg btn-default filter-button">{{ \'BUTTON.FILTER\' | translate}} {{ vm.visibleFilter ? "+" : "-" }}</button>\n' +
    '            <div ng-repeat="button in vm.listHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-ng-if="button.type == \'create\'" data-editor-button-create="" data-button-label="{{button.label}}" data-type="entity"></div>\n' +
    '                <div data-ng-if="button.type == \'request\'" data-ng-click="vm.contextAction(button)" class="btn btn-lg btn-success">{{button.label}}</div>\n' +
    '                <div data-ng-if="button.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '                <div data-ng-if="button.type == \'download\'" data-editor-button-download="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '            </div>\n' +
    '            <div ng-repeat="button in vm.mixedListHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-ng-if="button.type == \'create\'" data-editor-button-create="" data-button-label="{{button.label}}" data-type="vm.mixEntityType"></div>\n' +
    '                <div data-ng-if="button.type == \'request\'" data-ng-click="vm.contextAction(button)" class="btn btn-lg btn-success">{{button.label}}</div>\n' +
    '                <div data-ng-if="button.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '                <div data-ng-if="button.type == \'download\'" data-editor-button-download="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-hide="vm.visibleFilter || (vm.entityLoaded || vm.loadingData)" class="editor-filter">\n' +
    '            <div ng-keyup="vm.clickEnter($event)" class="editor-filter-wrapper">\n' +
    '                <div data-ng-repeat="filter in vm.filterFields" data-filter-wrapper="" data-filter-name="{{filter.name}}"></div>\n' +
    '                <div class="buttons-wrapper">\n' +
    '                    <button data-ng-click="vm.applyFilter()" class="btn btn-sm btn-success">{{\'BUTTON.APPLY\' | translate}}</button>\n' +
    '                    <button data-ng-click="vm.clearFilter()" class="btn btn-sm btn-default">{{\'BUTTON.CLEAN\' | translate}}</button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="groups-action">\n' +
    '            <button data-ng-if="vm.parentButton &amp;&amp; !vm.entityLoaded &amp;&amp; !vm.loadingData" data-ng-click="vm.getParent()" class="btn btn-sm btn-default">{{\'BUTTON.HIGHER_LEVEL\' | translate}}</button>\n' +
    '        </div>\n' +
    '        <div data-ng-show="vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '        <ue-table data-table-fields="vm.tableFields" data-sort-field="vm.sortField" data-sorting-direction="vm.sortingDirection" data-change-sort-field="vm.changeSortField" data-list-loaded="vm.listLoaded" data-items="vm.items" data-toggle-context-view="vm.toggleContextView" data-context-links="vm.contextLinks" data-context-id="vm.contextId" data-context-action="vm.contextAction" data-mix-context-links="vm.mixContextLinks" data-mix-entity-type="vm.mixEntityType" data-prepend-icon="vm.prependIcon" data-page-items-array="vm.pageItemsArray" data-meta-key="vm.metaKey" data-id-field="vm.idField" data-pagination="vm.pagination" data-change-page="vm.changePage"></ue-table>\n' +
    '        <!--table.table.table-bordered(data-ng-hide="vm.entityLoaded || vm.loadingData", class="items-list")\n' +
    '        thead\n' +
    '           tr\n' +
    '              td.actions-header.context-column\n' +
    '              td( data-ng-repeat="fieldItem in vm.tableFields",\n' +
    '              data-ng-class="{ \'active\' : fieldItem.field == vm.sortField, \'asc\' : vm.sortingDirection, \'desc\' : !vm.sortingDirection}",\n' +
    '              data-ng-click="vm.changeSortField(fieldItem.field)") {{fieldItem.displayName}}\n' +
    '        tbody(data-ng-if="vm.listLoaded")\n' +
    '           tr(data-ng-repeat="item in vm.items", data-ng-class="{\'zhs-item\' : (vm.entityType !== item[vm.subType]) && item[vm.subType] !== undefined}")\n' +
    '              td.context-column\n' +
    '                 span.context-toggle(data-ng-click="vm.toggleContextView(item[vm.idField])", data-ng-show="vm.contextLinks.length") Toggle buttons\n' +
    '                 .context-menu-wrapper(data-ng-show="vm.contextId == item[vm.idField]")\n' +
    '                    .context-menu-item(data-ng-repeat="link in vm.contextLinks track by $index", data-ng-if="(item[vm.subType] == vm.entityType || item[vm.subType] == undefined)")\n' +
    '                       div(data-ng-if="link.type == \'request\'", data-ng-click="vm.contextAction(link,item[vm.idField])") {{link.label}}\n' +
    '                       div(data-ng-if="link.type == \'edit\'", data-editor-button-edit="", data-entity-subtype="{{item[vm.subType]}}",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}")\n' +
    '                       div(data-ng-if="link.type == \'delete\'", data-editor-button-delete="",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-button-class="context")\n' +
    '                       div(data-ng-if="link.type == \'open\'", data-editor-button-open="",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}")\n' +
    '                       div(data-ng-if="link.type == \'download\'", data-editor-button-download="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")\n' +
    '                       div(data-ng-if="link.type == \'targetBlank\'", data-editor-button-target-blank="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")\n' +
    '                    .context-menu-item(data-ng-repeat="link in vm.mixContextLinks track by $index", data-ng-if="vm.mixEntityType && item[vm.subType] === vm.mixEntityType")\n' +
    '                       div(data-ng-if="link.type == \'request\'", data-ng-click="vm.contextAction(link,item[vm.idField])") {{link.label}}\n' +
    '                       div(data-ng-if="link.type == \'edit\'", data-editor-button-edit="", data-entity-subtype="{{item[vm.subType]}}",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}")\n' +
    '                       div(data-ng-if="link.type == \'delete\'", data-entity-type="mix", data-editor-button-delete="",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-button-class="context")\n' +
    '                       div(data-ng-if="link.type == \'download\'", data-editor-button-download="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")\n' +
    '                       div(data-ng-if="link.type == \'targetBlank\'", data-editor-button-target-blank="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")\n' +
    '              td(data-ng-repeat="fieldItem in vm.tableFields track by $index")\n' +
    '                 span.glyphicon(\n' +
    '                 data-ng-class="{\'glyphicon-folder-open icon-mix-mode\' : (vm.isMixMode && !((vm.entityType !== item[vm.subType]) && item[vm.subType] !== undefined))}",\n' +
    '                 data-ng-if=\'vm.prependIcon === fieldItem.field\'\n' +
    '                 )\n' +
    '                 span(style="padding-left: {{ item.parentPadding ? item.parentPadding * 10 : 0 }}px;") {{item[fieldItem.field]}}\n' +
    '           tr(data-ng-if="vm.items.length == 0")\n' +
    '              td(colspan="{{vm.tableFields.length + 1}}")\n' +
    '                 | {{\'ELEMENT_NO\' | translate}}\n' +
    '        tfoot\n' +
    '           tr(data-ng-if="vm.metaKey")\n' +
    '              td(colspan="{{vm.tableFields.length + 1}}")\n' +
    '                 .meta-info {{\'ELEMENTS\' | translate}} {{vm.metaData.fromItem}} - {{vm.metaData.toItem}} {{\'FROM\' | translate}} {{vm.metaData.totalCount}}\n' +
    '           tr\n' +
    '              td(colspan="{{vm.tableFields.length + 1}}", data-ng-if="vm.pagination && vm.metaKey")\n' +
    '                 ul.pagination\n' +
    '                    li(data-ng-repeat="pageItem in vm.pageItemsArray", data-ng-class="pageItem.self ? \'active\' : \'\'")\n' +
    '                       a(data-ng-if="!pageItem.self", href="{{pageItem.href}}", data-ng-click="vm.changePage($event,pageItem.href)") {{pageItem.label}}\n' +
    '                       span(data-ng-if="pageItem.self") {{pageItem.label}}\n' +
    '        -->\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
