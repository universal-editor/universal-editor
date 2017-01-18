(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeGridController', UeGridController);

    UeGridController.$inject = ['$scope', '$rootScope', 'configData', 'RestApiService', 'FilterFieldsStorage', '$location', '$document', '$timeout', '$httpParamSerializer', '$state', 'toastr', '$translate', '$element', '$compile', 'EditEntityStorage'];

    function UeGridController($scope, $rootScope, configData, RestApiService, FilterFieldsStorage, $location, $document, $timeout, $httpParamSerializer, $state, toastr, $translate, $element, $compile, EditEntityStorage) {
        $element.addClass('ue-grid');
        //$scope.entity = RestApiService.getEntityType();
        /* jshint validthis: true */
        var vm = this,
            itemsKey,
            mixEntityObject,
            url,
            parentField;

        vm.$onInit = function() {
            url = vm.setting.component.settings.dataSource.url;
            parentField = vm.setting.component.settings.dataSource.parentField;
            vm.configData = configData;
            vm.correctEntityType = true;
            vm.listLoaded = false;
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


            vm.options = {
                $parentComponentId: vm.$parentComponentId,
                $gridComponentId: vm.$parentComponentId,
                mixedMode: vm.setting.component.settings.mixedMode,
                sort: vm.setting.component.settings.dataSource.sortBy,
                back: configData,
                isGrid: true
            };
            vm.mixOption = angular.merge({}, vm.options);
            vm.mixOption.isMix = true;
            if (!!vm.setting.component.settings.header) {
                vm.filterComponent = vm.setting.component.settings.header.filter;
            } else {
                vm.filterComponent = vm.setting.component.settings.header;
            }
            if (vm.filterComponent !== false) {
                if (angular.isUndefined(vm.filterComponent)) {
                    vm.filterComponent = {
                        component: {
                            name: 'ue-filter',
                            settings: {
                                header: {
                                    label: 'Фильтр'
                                }
                            }
                        }
                    };
                }

                if (angular.isUndefined(vm.filterComponent.component.settings.dataSource)) {
                    vm.filterComponent.component.settings.dataSource = vm.setting.component.settings.dataSource;
                }
            }
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
            vm.entityType = vm.setting.component.settings.entityType || configData;
            vm.parent = null;
            vm.paginationData = [];
            vm.isMixMode = !!vm.setting.component.settings.mixedMode;
            if (vm.isMixMode) {
                vm.prependIcon = vm.setting.component.settings.mixedMode.prependIcon;
                vm.entityType = vm.setting.component.settings.mixedMode.entityType;
                vm.subType = vm.setting.component.settings.mixedMode.fieldType;

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

            // if (vm.setting.headComponent) {
            var parentEntity = $location.search().parent;
            if (parentEntity) {
                parentEntity = JSON.parse(parentEntity);
                vm.parent = parentEntity[vm.$parentComponentId] || null;
            }
            //   }

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


            angular.forEach(vm.setting.component.settings.dataSource.fields, function(field) {
                if (field.component.hasOwnProperty('settings') && (vm.setting.component.settings.columns.indexOf(field.name) != -1)) {

                }
            });

            angular.forEach(vm.setting.component.settings.contextMenu, function(value) {
                var newValue = angular.merge({}, value);
                newValue.url = url;
                newValue.parentField = parentField;
                newValue.headComponent = vm.setting.headComponent;
                vm.contextLinks.push(newValue);
            });

            if (!!vm.setting.component.settings.header && !!vm.setting.component.settings.header.controls) {
                angular.forEach(vm.setting.component.settings.header.controls, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
                    }
                    newControl.paginationData = {};
                    vm.listHeaderBar.push(newControl);
                });
            }

            if (!!vm.setting.component.settings.footer && !!vm.setting.component.settings.footer.controls) {
                angular.forEach(vm.setting.component.settings.footer.controls, function(control) {
                    var newControl = angular.merge({}, control);
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

            RestApiService.setFilterParams({});
            vm.request.childId = vm.parent;
            vm.request.options = vm.options;
            vm.request.parentField = parentField;
            vm.request.url = url;
            RestApiService.getItemsList(vm.request);
        };

        function getScope() {
            return $scope;
        }

        function setTabVisible(index, value) {
            vm.tabsVisibility[index] = value;
        }

        function changeSortField(field, sorted) {
            if (field && sorted) {
                vm.listLoaded = false;
                if (vm.sortField == field) {
                    vm.sortingDirection = !vm.sortingDirection;
                } else {
                    vm.sortField = field;
                }
                vm.options.sort = vm.sortingDirection ? field : '-' + field;
                RestApiService.getItemsList({
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
            vm.request.headComponent = vm.setting.headComponent;
            RestApiService.loadParent(vm.request);
        }

        $scope.$on('editor:parent_id', function(event, data) {
            if (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
                vm.parent = data.parentId;
            }
        });


        $scope.$on('editor:read_entity', function(event, data) {
            var eventComponentId = data.$gridComponentId || data.$parentComponentId || data;
            if (vm.$parentComponentId === eventComponentId) {
                var parentEntity = $location.search().parent;
                if (parentEntity) {
                    parentEntity = JSON.parse(parentEntity);
                    vm.parent = parentEntity[vm.$parentComponentId] || null;
                }
                vm.request.childId = vm.parent;
                RestApiService.getItemsList(vm.request);
            }
        });

        $scope.$on('editor:update_item', function(event, data) {
            var eventComponentId = data.$gridComponentId || data.$parentComponentId ;
            if (!eventComponentId || (vm.$parentComponentId === eventComponentId && data.value)) {
                var changed = false;
                vm.items.filter(function(item) {
                    if(item[vm.idField] === data.value[vm.idField]) {
                        angular.merge(item, data.value);
                        changed = true;
                    }
                });
                if(changed) {
                    var list = {};
                    list[itemsKey] = vm.items;
                $rootScope.$broadcast('editor:items_list', list);
                }
            }
        });

        $scope.$on('editor:items_list', function(event, data) {
            if (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
                vm.listLoaded = true;
                vm.items = data[itemsKey];
                if (angular.isObject(vm.items)) {
                    angular.forEach(vm.items, function(item, index) {
                        item.$options = {
                            $parentComponentId: vm.$parentComponentId,
                            regim: 'preview',
                            $dataIndex: index
                        };
                    });
                }
                var eventObject = {
                    editorEntityType: 'exist',
                    $parentComponentId: vm.$parentComponentId,
                    $items: vm.items
                };
                $timeout(function() {
                    $rootScope.$broadcast('editor:entity_loaded', eventObject);
                });

                vm.parentButton = !!vm.parent;
                vm.pageItemsArray = [];

                angular.forEach(vm.listFooterBar, function(control) {
                    control.paginationData = data;
                });
            }
        });

        $scope.$on('editor:server_error', function(event, data) {
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
            var left = event.pageX - $element.find('table')[0].offsetLeft;
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