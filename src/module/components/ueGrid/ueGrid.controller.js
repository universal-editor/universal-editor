(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeGridController', UeGridController);

    function UeGridController($scope, $rootScope, YiiSoftApiService, FilterFieldsStorage, $location, $document, $timeout, $httpParamSerializer, $state, $translate, $element, $compile, EditEntityStorage, $controller) {
        /* jshint validthis: true */
        "ngInject";
        $element.addClass('ue-grid');
        var vm = this,
            itemsKey,
            mixEntityObject,
            url,
            parentField;

        vm.$onInit = function() {
            //** Nested base controller */
            angular.extend(vm, $controller('BaseController', { $scope: $scope }));

            url = vm.setting.component.settings.dataSource.url;
            parentField = vm.setting.component.settings.dataSource.parentField;
            vm.correctEntityType = true;
            vm.loaded = false;
            vm.loadingData = true;
            vm.tableFields = [];
            vm.items = [];
            vm.links = [];
            vm.errors = [];
            vm.notifys = [];
            vm.tabsVisibility = [];
            vm.entityId = '';
            vm.editorEntityType = 'new';
            vm.sortField = '';
            vm.sortingDirection = true;
            vm.pageItemsArray = [];
            vm.contextLinks = [];
            vm.mixContextLinks = [];
            vm.listHeaderBar = [];
            vm.$parentComponentId = vm.setting.component.$id;
            vm.isContextMenu = (!!vm.setting.component.settings.contextMenu && (vm.setting.component.settings.contextMenu.length !== 0));
            vm.prefixGrid = undefined;

            if (vm.setting.component.settings.routing && vm.setting.component.settings.routing.paramsPrefix) {
                vm.prefixGrid = vm.setting.component.settings.routing.paramsPrefix;
            }


            vm.options = {
                $parentComponentId: vm.$parentComponentId,
                $gridComponentId: vm.$parentComponentId,
                prefixGrid: vm.prefixGrid,
                mixedMode: vm.setting.component.settings.mixedMode,
                sort: vm.setting.component.settings.dataSource.sortBy,
                isGrid: true
            };

            vm.mixOption = angular.merge({}, vm.options);
            vm.mixOption.isMix = true;
            vm.editFooterBarNew = [];
            vm.editFooterBarExist = [];
            vm.listFooterBar = [];
            vm.contextId = undefined;
            vm.idField = 'id';
            vm.parentButton = false;
            vm.filterFields = [];
            vm.visibleFilter = true;
            vm.pagination = vm.setting.component.settings.dataSource.hasOwnProperty('pagination') ? vm.setting.component.settings.dataSource.pagination : true;
            vm.autoCompleteFields = [];
            vm.entityType = vm.setting.component.settings.entityType;
            vm.parent = null;
            vm.paginationData = [];
            vm.isMixMode = !!vm.setting.component.settings.mixedMode;
            if (vm.isMixMode) {
                vm.prependIcon = vm.setting.component.settings.mixedMode.prependIcon;
                vm.entityType = vm.setting.component.settings.mixedMode.entityType;
                vm.subType = vm.setting.component.settings.mixedMode.fieldType;
                vm.collectionType = vm.setting.component.settings.mixedMode.collectionType;

                angular.forEach(vm.setting.component.settings.mixedMode.contextMenu, function(value) {
                    var newValue = angular.merge({}, value);
                    newValue.url = vm.setting.component.settings.mixedMode.dataSource.url;
                    newValue.parentField = parentField;
                    newValue.headComponent = vm.setting.headComponent;
                    vm.mixContextLinks.push(newValue);
                });
            }
            vm.request = {
                childId: vm.parent,
                options: vm.options,
                parentField: parentField,
                url: url
            };
            vm.request.options.$dataSource = vm.setting.component.settings.dataSource;

            var parentEntity = $location.search()[vm.prefixGrid ? vm.prefixGrid + '-parent' : 'parent'];
            vm.parent = parentEntity || null;

            if (vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')) {
                vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
            }
            itemsKey = 'items';

            var colSettings = vm.setting.component.settings.columns;

            if (angular.isArray(colSettings)) {
                colSettings.forEach(function(col) {
                    var tableField;
                    var component = vm.setting.component.settings.dataSource.fields.filter(function(field) {
                        return field.name === col;
                    });
                    if (component.length) {
                        col = component[0];
                    }
                    if (angular.isObject(col)) {
                        tableField = {
                            field: col.name || null,
                            sorted: col.component.settings.multiple !== true,
                            displayName: col.component.settings.label || col.name,
                            component: col,
                            options: {
                                $parentComponentId: vm.$parentComponentId,
                                regim: 'preview'
                            }
                        };

                    }
                    if (tableField) {
                        vm.tableFields.push(tableField);
                    }
                });
            }

            angular.forEach(vm.setting.component.settings.contextMenu, function(value) {
                var newValue = angular.merge({}, value);
                newValue.url = url;
                newValue.parentField = parentField;
                newValue.headComponent = vm.setting.headComponent;
                vm.contextLinks.push(newValue);
            });

            if (!!vm.setting.component.settings.header && !!vm.setting.component.settings.header.toolbar) {
                angular.forEach(vm.setting.component.settings.header.toolbar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings)) {
                        newControl.component.settings = {};
                    }
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
                    }
                    newControl.paginationData = {};
                    vm.listHeaderBar.push(newControl);
                });
            }

            if (!!vm.setting.component.settings.footer && !!vm.setting.component.settings.footer.toolbar) {
                angular.forEach(vm.setting.component.settings.footer.toolbar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings)) {
                        newControl.component.settings = {};
                    }
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
                    }
                    newControl.paginationData = {};
                    vm.listFooterBar.push(newControl);
                });
            }

            vm.sortField = vm.setting.component.settings.dataSource.sortBy || vm.tableFields[0].field;

            vm.toggleContextView = toggleContextView;
            vm.toggleContextViewByEvent = toggleContextViewByEvent;
            vm.getParent = getParent;
            vm.getScope = getScope;
            vm.setTabVisible = setTabVisible;
            vm.changeSortField = changeSortField;

            vm.request.childId = vm.parent;
            vm.request.options = vm.options;
            vm.request.parentField = parentField;
            vm.request.url = url;
            YiiSoftApiService.getItemsList(vm.request);
        };

        function getScope() {
            return $scope;
        }

        function setTabVisible(index, value) {
            vm.tabsVisibility[index] = value;
        }

        function changeSortField(field, sorted) {
            if (field && sorted) {
                vm.loaded = false;
                if (vm.sortField == field) {
                    vm.sortingDirection = !vm.sortingDirection;
                } else {
                    vm.sortField = field;
                }
                vm.options.sort = vm.sortingDirection ? field : '-' + field;
                YiiSoftApiService.getItemsList({
                    url: url,
                    options: vm.options,
                    parentField: parentField,
                    childId: vm.parent
                });
            }
        }

        function getParent() {
            vm.request.childId = vm.parent;
            vm.request.parentField = parentField;
            vm.request.prefixGrid = vm.prefixGrid;
            vm.request.headComponent = vm.setting.headComponent;
            YiiSoftApiService.loadParent(vm.request);
        }

        $scope.$on('editor:parent_id', function(event, data) {
            if (!data.$parentComponentId || vm.isParentComponent(data.$parentComponentId)) {
                vm.parent = data.parentId;
            }
        });


        $scope.$on('ue:collectionRefresh', function(event, data) {
            var eventComponentId = data.$gridComponentId || data.$parentComponentId || data;
            if (vm.$parentComponentId === eventComponentId) {
                vm.parent = $location.search()[vm.prefixGrid ? vm.prefixGrid + '-parent' : 'parent'] || null;
                vm.request.childId = vm.parent;
                YiiSoftApiService.getItemsList(vm.request);
            }
        });

        $scope.$on('editor:update_item', function(event, data) {
            var eventComponentId = data.$gridComponentId || data.$parentComponentId;
            if (!eventComponentId || (vm.$parentComponentId === eventComponentId && data.value)) {
                var changed = false;
                vm.items.filter(function(item) {
                    if (item[vm.idField] === data.value[vm.idField]) {
                        angular.merge(item, data.value);
                        changed = true;
                    }
                });
                if (changed) {
                    var list = {};
                    list[itemsKey] = vm.items;
                    $rootScope.$broadcast('ue:collectionLoaded', list);
                }
            }
        });

        $scope.$on('ue:collectionLoaded', function(event, data) {
            if (!data.$parentComponentId || vm.isParentComponent(data.$parentComponentId)) {
                vm.loaded = true;
                vm.items = data[itemsKey];

                var components = vm.tableFields.map(function(f) { return f.component; });
                if (angular.isObject(vm.items)) {
                    angular.forEach(vm.items, function(item, index) {
                        item.$options = {
                            $parentComponentId: vm.$parentComponentId,
                            regim: 'preview',
                            $dataIndex: index
                        };
                    });
                }
                var options = {
                    data: vm.items,
                    components: components,
                    $id: vm.$parentComponentId
                };
                YiiSoftApiService.extendData(options).then(function(data) {
                    var eventObject = {
                        editorEntityType: 'exist',
                        $parentComponentId: vm.$parentComponentId,
                        $items: data
                    };
                    $timeout(function() {
                        $rootScope.$broadcast('ue:componentDataLoaded', eventObject);
                    });
                });

                vm.parentButton = !!vm.parent;
                vm.pageItemsArray = [];

                angular.forEach(vm.listFooterBar, function(control) {
                    control.paginationData = data;
                });
            }
        });

        $scope.$on('editor:server_error', function(event, data) {
             if (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
                 vm.listLoaded = true;
             }
            vm.errors.push(data);
        });

        $scope.$on('editor:parent_childs', function(event, data) {
            angular.forEach(vm.items, function(item, ind) {

                var startInd = 1;
                if (item[vm.idField] === data.id) {
                    if (item.isExpand === true) {
                        item.isExpand = false;
                        vm.items.splice(ind + 1, data.childs.length);
                    } else {
                        item.isExpand = true;
                        angular.forEach(data.childs, function(newItem) {
                            if (vm.items[ind].hasOwnProperty.parentPadding) {
                                newItem.parentPadding = vm.items[ind].parentPadding + 1;
                            } else {
                                newItem.parentPadding = 1;
                            }
                            vm.items.splice(ind + startInd, 0, newItem);
                        });
                    }

                }
            });
        });

        $scope.$on('editor:entity_success_deleted', function(event, data) {
        });

        $scope.$on('editor:field_error', function(event, data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function(event, data) {
            vm.errors = [];
            vm.notifys = [];
        });

        $document.on('click', function(evt) {
            if (!angular.element(evt.target).hasClass('context-toggle')) {
                $timeout(function() {
                    vm.contextId = undefined;
                }, 0);
            }
        });


        function isInTableFields(name) {
            var index = vm.tableFields.findIndex(function(field) {
                return field.field === name;
            });

            return index !== -1;
        }

        function toggleContextView(id) {
            vm.styleContextMenu = {};
            if (vm.contextId == id) {
                vm.contextId = undefined;
            } else {
                vm.contextId = id;
            }
        }

        function toggleContextViewByEvent(id, event) {
            var left = event.pageX - $element.find('table')[0].getBoundingClientRect().left;
            if (event.which === 3) {
                vm.styleContextMenu = {
                    'top': event.offsetY,
                    'left': left
                };
                vm.contextId = id;
            }
        }
    }
})();