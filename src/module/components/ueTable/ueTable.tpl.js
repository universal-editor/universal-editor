(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueTable/ueTable.html',
    '\n' +
    '<div>\n' +
    '    <div class="editor-header">\n' +
    '        <!--button.btn.btn-lg.btn-default.filter-button(data-ng-click="vm.toggleFilterVisibility()", data-ng-class="{ disabled : vm.entityLoaded }")| {{ \'BUTTON.FILTER\' | translate}} {{ vm.visibleFilter ? "+" : "-" }}\n' +
    '        -->\n' +
    '        <button-wrapper ng-repeat="button in vm.listHeaderBar track by $index" data-setting="button" data-button-class="header" class="header-action-button">\n' +
    '            <!--ue-button-create(data-ng-if="button.type == \'create\'", data-button-label="{{button.label}}")-->\n' +
    '            <!--div.btn.btn-lg.btn-success(data-ng-if="button.type == \'request\'", data-ng-click="vm.contextAction(button)") {{button.label}}-->\n' +
    '            <!--div(data-ng-if="button.type == \'targetBlank\'", data-editor-button-target-blank="", data-item-value="item", data-button-label="{{button.label}}", data-button-request="{{button.request}}", data-index="{{$index}}", data-button-class="header")-->\n' +
    '            <!--div(data-ng-if="button.type == \'download\'", data-editor-button-download="", data-item-value="item", data-button-label="{{button.label}}", data-button-request="{{button.request}}", data-index="{{$index}}", data-button-class="header")-->\n' +
    '        </button-wrapper>\n' +
    '        <!--.header-action-button(ng-repeat="button in vm.mixedListHeaderBar track by $index")\n' +
    '        ue-button-create(data-ng-if="button.type == \'create\'", data-button-label="{{button.label}}", data-type="vm.mixEntityType")\n' +
    '        div.btn.btn-lg.btn-success(data-ng-if="button.type == \'request\'", data-ng-click="vm.contextAction(button)") {{button.label}}\n' +
    '        div(data-ng-if="button.type == \'targetBlank\'", data-editor-button-target-blank="", data-item-value="item", data-button-label="{{button.label}}", data-button-request="{{button.request}}", data-index="{{$index}}", data-button-class="header")\n' +
    '        div(data-ng-if="button.type == \'download\'", data-editor-button-download="", data-item-value="item", data-button-label="{{button.label}}", data-button-request="{{button.request}}", data-index="{{$index}}", data-button-class="header")\n' +
    '        -->\n' +
    '    </div>\n' +
    '    <!--.editor-filter(data-ng-hide="vm.visibleFilter || (vm.entityLoaded || vm.loadingData)")\n' +
    '    .editor-filter-wrapper(ng-keyup="vm.clickEnter($event)")\n' +
    '        div(data-ng-repeat="filter in vm.filterFields", data-filter-wrapper="", data-filter-name="{{filter.name}}")\n' +
    '        .buttons-wrapper\n' +
    '            button.btn.btn-sm.btn-success(data-ng-click="vm.applyFilter()") {{\'BUTTON.APPLY\' | translate}}\n' +
    '            button.btn.btn-sm.btn-default(data-ng-click="vm.clearFilter()") {{\'BUTTON.CLEAN\' | translate}}\n' +
    '    -->\n' +
    '    <div class="groups-action">\n' +
    '        <button data-ng-if="vm.parentButton &amp;&amp; !vm.entityLoaded &amp;&amp; !vm.loadingData" data-ng-click="vm.getParent()" class="btn btn-sm btn-default">{{\'BUTTON.HIGHER_LEVEL\' | translate}}</button>\n' +
    '    </div>\n' +
    '    <div data-ng-show="vm.loadingData" class="processing-status-wrapper">\n' +
    '        <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <table data-ng-hide="vm.entityLoaded || vm.loadingData" class="table table-bordered items-list">\n' +
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
    '                            <button-wrapper data-setting="link" data-entity-id="{{item[vm.idField]}}" data-button-class="context"></button-wrapper>\n' +
    '                            <!--div(data-ng-if="link.type == \'request\'", data-ng-click="vm.contextAction(link,item[vm.idField])") {{link.label}}-->\n' +
    '                            <!--ue-button-edit(data-ng-if="link.type == \'edit\'", data-entity-subtype="{{item[vm.subType]}}",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}")-->\n' +
    '                            <!--ue-button-delete(data-ng-if="link.type == \'delete\'",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-button-class="context")-->\n' +
    '                            <!--ue-button-open(data-ng-if="link.type == \'open\'", data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}")-->\n' +
    '                            <!--div(data-ng-if="link.type == \'download\'", data-editor-button-download="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")-->\n' +
    '                            <!--div(data-ng-if="link.type == \'targetBlank\'", data-editor-button-target-blank="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")-->\n' +
    '                        </div>\n' +
    '                        <!--.context-menu-item(data-ng-repeat="link in vm.mixContextLinks track by $index", data-ng-if="vm.mixEntityType && item[vm.subType] === vm.mixEntityType")\n' +
    '                        div(data-ng-if="link.type == \'request\'", data-ng-click="vm.contextAction(link,item[vm.idField])") {{link.label}}\n' +
    '                        div(data-ng-if="link.type == \'edit\'", data-editor-button-edit="", data-entity-subtype="{{item[vm.subType]}}",data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}")\n' +
    '                        ue-delete-button(data-ng-if="link.type == \'delete\'", data-entity-type="mix", data-entity-id="{{item[vm.idField]}}", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-button-class="context")\n' +
    '                        div(data-ng-if="link.type == \'download\'", data-editor-button-download="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")\n' +
    '                        div(data-ng-if="link.type == \'targetBlank\'", data-editor-button-target-blank="", data-item-value="item", data-button-label="{{link.label}}", data-button-request="{{link.request}}", data-index="{{$index}}", data-button-class="context")\n' +
    '                        -->\n' +
    '                    </div>\n' +
    '                </td>\n' +
    '                <td data-ng-repeat="fieldItem in vm.tableFields track by $index"><span data-ng-class="{\'glyphicon-folder-open icon-mix-mode\' : (vm.isMixMode &amp;&amp; !((vm.entityType !== item[vm.subType]) &amp;&amp; item[vm.subType] !== undefined))}" data-ng-if="vm.prependIcon === fieldItem.field" class="glyphicon"></span><span style="padding-left: {{ item.parentPadding ? item.parentPadding * 10 : 0 }}px;">{{item[fieldItem.field]}}</span></td>\n' +
    '            </tr>\n' +
    '            <tr data-ng-if="vm.items.length == 0">\n' +
    '                <td colspan="{{vm.tableFields.length + 1}}">{{\'ELEMENT_NO\' | translate}}</td>\n' +
    '            </tr>\n' +
    '        </tbody>\n' +
    '        <tfoot>\n' +
    '            <tr data-ng-if="vm.metaKey">\n' +
    '                <td colspan="{{vm.tableFields.length + 1}}">\n' +
    '                    <div class="meta-info">{{\'ELEMENTS\' | translate}} {{vm.metaData.fromItem}} - {{vm.metaData.toItem}} {{\'FROM\' | translate}} {{vm.metaData.totalCount}}</div>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '            <tr>\n' +
    '                <td colspan="{{vm.tableFields.length + 1}}" data-ng-if="vm.pagination &amp;&amp; vm.metaKey">\n' +
    '                    <ul class="pagination">\n' +
    '                        <li data-ng-repeat="pageItem in vm.pageItemsArray" data-ng-class="pageItem.self ? \'active\' : \'\'"><a data-ng-if="!pageItem.self" href="{{pageItem.href}}" data-ng-click="vm.changePage($event,pageItem.href)">{{pageItem.label}}</a><span data-ng-if="pageItem.self">{{pageItem.label}}</span></li>\n' +
    '                    </ul>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </tfoot>\n' +
    '    </table>\n' +
    '</div>');
}]);
})();
