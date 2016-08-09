(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/universalEditor/universalEditor.html',
    '\n' +
    '<div class="universal-editor">\n' +
    '    <div class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.errors" class="error-item">{{err}}</div>\n' +
    '    </div>\n' +
    '    <div class="field-notify-wrapper">\n' +
    '        <div data-ng-repeat="notify in vm.notifys" class="notify-item">{{notify}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="vm.correctEntityType">\n' +
    '        <div class="editor-header">\n' +
    '            <button data-ng-click="vm.toggleFilterVisibility()" data-ng-class="{ disabled : vm.entityLoaded }" class="header-action-button gray">{{ \'BUTTON.FILTER\' | translate}} {{ vm.visibleFilter ? "+" : "-" }}</button>\n' +
    '            <div ng-repeat="button in vm.listHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-editor-button-create="" data-button-label="{{button.label}}" ng-if="button.type === \'create\'" data-type="entity"></div>\n' +
    '                <div data-ng-if="button.type == \'custom\'" data-ng-click="vm.headerAction(button)">{{button.label}}</div>\n' +
    '            </div>\n' +
    '            <div ng-repeat="button in vm.mixedListHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-editor-button-create="" data-button-label="{{button.label}}" ng-if="button.type === \'create\'" data-type="vm.mixEntityType"></div>\n' +
    '                <div data-ng-if="button.type == \'custom\'" data-ng-click="vm.headerAction(button)">{{button.label}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-hide="vm.visibleFilter || (vm.entityLoaded || vm.loadingData)" class="editor-filter">\n' +
    '            <div class="editor-filter-wrapper">\n' +
    '                <div data-ng-repeat="filter in vm.filterFields" data-filter-wrapper="" data-filter-name="{{filter.name}}"></div>\n' +
    '                <div class="buttons-wrapper">\n' +
    '                    <button data-ng-click="vm.applyFilter()" class="editor-action-button gray">{{\'BUTTON.APPLY\' | translate}}</button>\n' +
    '                    <button data-ng-click="vm.clearFilter()" class="editor-action-button gray">{{\'BUTTON.CLEAN\' | translate}}</button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="groups-action">\n' +
    '            <button data-ng-if="vm.parentButton &amp;&amp; !vm.entityLoaded &amp;&amp; !vm.loadingData" data-ng-click="vm.getParent()" class="editor-action-button gray">{{\'BUTTON.HIGHER_LEVEL\' | translate}}</button>\n' +
    '        </div>\n' +
    '        <div data-ng-show="vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '        <table data-ng-hide="vm.entityLoaded || vm.loadingData" class="items-list">\n' +
    '            <thead>\n' +
    '                <tr>\n' +
    '                    <td class="actions-header context-column"></td>\n' +
    '                    <td data-ng-repeat="fieldItem in vm.tableFields" data-ng-class="{ \'active\' : fieldItem.field == vm.sortField, \'asc\' : vm.sortingDirection, \'desc\' : !vm.sortingDirection}" data-ng-click="vm.changeSortField(fieldItem.field)">{{fieldItem.displayName}}</td>\n' +
    '                </tr>\n' +
    '            </thead>\n' +
    '            <tbody data-ng-if="vm.listLoaded">\n' +
    '                <tr data-ng-repeat="item in vm.items">\n' +
    '                    <td class="context-column"><span data-ng-click="vm.toggleContextView(item[vm.idField])" data-ng-show="vm.contextLinks.length" class="context-toggle">Toggle buttons</span>\n' +
    '                        <div data-ng-show="vm.contextId == item[vm.idField]" class="context-menu-wrapper">\n' +
    '                            <div data-ng-repeat="link in vm.contextLinks track by $index" class="context-menu-item">\n' +
    '                                <div data-ng-if="link.type == \'custom\'" data-ng-click="vm.contextAction($index,item[vm.idField])">{{link.label}}</div>\n' +
    '                                <div data-ng-if="link.type == \'edit\'" data-editor-button-edit="" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-params="{{link.params}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'delete\'" data-editor-button-delete="" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-params="{{link.params}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'open\'" data-editor-button-open="" data-entity-id="{{item[vm.idField]}}" data-entity-type="" data-button-label="{{link.label}}" data-button-params="{{link.params}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'download\'" data-editor-button-download="" data-item-value="{{item}}" data-button-label="{{link.label}}" data-button-params="{{link.params}}" data-index="{{$index}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="{{item}}" data-button-label="{{link.label}}" data-button-params="link.request" data-index="{{$index}}"></div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                    <td data-ng-repeat="fieldItem in vm.tableFields"><span style="padding-left: {{ item.parentPadding ? item.parentPadding * 10 : 0 }}px">{{item[fieldItem.field]}}</span></td>\n' +
    '                </tr>\n' +
    '                <tr data-ng-if="vm.items.length == 0">\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">{{\'ELEMENT_NO\' | translate}}</td>\n' +
    '                </tr>\n' +
    '            </tbody>\n' +
    '            <tfoot data-ng-if="vm.pagination">\n' +
    '                <tr>\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">\n' +
    '                        <div class="meta-info">{{\'ELEMENTS\' | translate}} {{vm.metaData.fromItem}} - {{vm.metaData.toItem}} {{\'FROM\' | translate}} {{vm.metaData.totalCount}}</div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">\n' +
    '                        <div class="links-wrapper">\n' +
    '                            <div data-ng-repeat="pageItem in vm.pageItemsArray"><a data-ng-if="!pageItem.self" href="{{pageItem.href}}" data-ng-click="vm.changePage(pageItem.href)">{{pageItem.label}}</a><span data-ng-if="pageItem.self">{{pageItem.label}}</span></div>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '            </tfoot>\n' +
    '        </table>\n' +
    '        <div data-ng-show="vm.entityLoaded" class="editor-body">\n' +
    '            <div data-ng-click="vm.closeButton()" ng-style="{\'background-image\':\'url(\'+ vm.assetsPath +\'/images/close.jpg)\'}" class="close-editor"></div>\n' +
    '            <div class="tab-label-wrapper">\n' +
    '                <div data-ng-repeat="(tkey,tab) in vm.tabs" data-ng-class="vm.currentTab == tab.label ? \'active\' : \'\'" data-ng-click="vm.currentTab = tab.label" class="tab-item-label">\n' +
    '                    <div>{{tab.label}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="tab-content-wrapper">\n' +
    '                <div data-ng-repeat="(tkey,tab) in vm.tabs" data-ng-show="vm.currentTab == tab.label" class="tab-item-content">\n' +
    '                    <div class="field-content-wrapper">\n' +
    '                        <div data-ng-repeat="field in tab.fields" data-field-wrapper="" data-field-name="{{field.name}}"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="field-error-bottom-wrapper">\n' +
    '                <div data-ng-repeat="err in vm.errors" class="error-item">{{err}}</div>\n' +
    '            </div>\n' +
    '            <div class="field-notify-bottom-wrapper">\n' +
    '                <div data-ng-repeat="notify in vm.notifys" class="notify-item">{{notify}}</div>\n' +
    '            </div>\n' +
    '            <div class="editor-entity-actions">\n' +
    '                <div data-ng-if="vm.getButton(\'add\') &amp;&amp; vm.editorEntityType == \'new\'" data-editor-button-add="" data-button-label="{{vm.getButton(\'add\').label}}"></div>\n' +
    '                <div data-ng-if="vm.getButton(\'presave\')" data-editor-button-presave="" data-entity-id="{{vm.entityId}}" data-button-label="{{vm.getButton(\'presave\').label}}"></div>\n' +
    '                <div data-ng-if="vm.getButton(\'update\') &amp;&amp; vm.editorEntityType == \'exist\'" data-editor-button-update="" data-entity-id="{{vm.entityId}}" data-button-label="{{vm.getButton(\'update\').label}}"></div>\n' +
    '                <div data-ng-if="vm.getButton(\'delete\') &amp;&amp; vm.editorEntityType == \'exist\'" data-editor-button-delete="" data-entity-id="{{vm.entityId}}" data-button-label="{{vm.getButton(\'delete\').label}}"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
