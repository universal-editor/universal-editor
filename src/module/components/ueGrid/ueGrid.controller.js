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

            vm.dataSource = vm.setting.component.settings.dataSource;

            url = vm.dataSource.url;
            parentField = vm.dataSource.parentField;

            vm.correctEntityType = true;
            vm.loaded = false;
            vm.loadingData = true;
            vm.tableFields = [];
            vm.items = [];
            vm.links = [];
            vm.errors = [];
            vm.tabsVisibility = [];
            vm.entityId = '';
            vm.editorEntityType = 'new';
            vm.sortField = '';
            vm.sortingDirection = true;
            vm.pageItemsArray = [];
            vm.contextLinks = [];
            vm.mixContextLinks = [];
            vm.listHeaderBar = [];
            vm.$componentId = vm.setting.component.$id;
            vm.isContextMenu = (!!vm.setting.component.settings.contextMenu && (vm.setting.component.settings.contextMenu.length !== 0));
            vm.prefixGrid = undefined;

            if (vm.setting.component.settings.routing && vm.setting.component.settings.routing.paramsPrefix) {
                vm.prefixGrid = vm.setting.component.settings.routing.paramsPrefix;
            }

            vm.options = {
                $componentId: vm.$componentId,
                prefixGrid: vm.prefixGrid,
                mixedMode: vm.setting.component.settings.mixedMode,
                sort: vm.setting.component.settings.dataSource.sortBy,
                isGrid: true,
                $dataSource: vm.dataSource
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

            vm.parent = $location.search()[getKeyPrefix('parent')];

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
                        col = angular.merge({}, component[0]);
                    }
                    if (angular.isObject(col)) {
                        tableField = {
                            field: col.name || null,
                            sorted: col.component.settings.multiple !== true,
                            displayName: col.component.settings.label || col.name,
                            component: col,
                            options: {
                                $componentId: vm.$componentId,
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

            if (FilterFieldsStorage.isFilterSearchParamEmpty(vm.prefixGrid)) {
                refreshTableRecords();
            }

            $scope.$watch(function() {
                return FilterFieldsStorage.getFilterController(vm.$componentId).isReady;
            }, function(filterReady) {
                if (filterReady) {
                    var newVal = $location.search();
                    if (!FilterFieldsStorage.isFilterSearchParamEmpty(vm.prefixGrid)) {
                        var filterName = vm.paramsPefix ? vm.paramsPefix + '-filter' : 'filter',
                            filter = JSON.parse(newVal[filterName]);
                        if (!$.isEmptyObject(filter)) {
                            FilterFieldsStorage.fillFilterComponent(vm.$componentId, filter);
                            $timeout(function() {
                                FilterFieldsStorage.calculate(vm.$componentId, filterName);
                                refreshTableRecords();
                            }, 0);
                        }
                    }
                }
            });
        };

        function setInitialQueryParams() {
            var locationObject = $location.search();
            var page = locationObject[getKeyPrefix('page')] || 1;
            var parent = locationObject[getKeyPrefix('parent')];
            var sortParameter = locationObject[getKeyPrefix('sort')];
            vm.request.childId = vm.parent;
            vm.request.params = vm.request.params || {};
            vm.request.params.page = page;

            if (sortParameter) {
                vm.sortingDirection = sortParameter[0] !== '-';
                vm.sortField = sortParameter.replace('-', '');
            }
            vm.request.params.sort = sortParameter || getSortParameter();
        }

        function getSortParameter(name) {
            name = name || vm.sortField;
            return vm.sortingDirection ? name : ('-' + name);
        }

        function getKeyPrefix(key) {
            if (!key && vm.options.prefixGrid) {
                return vm.options.prefixGrid;
            }
            return vm.options.prefixGrid ? (vm.options.prefixGrid + '-' + key) : key;
        }

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
                var sort = getSortParameter(field);
                $location.search(getKeyPrefix('sort'), sort);
                $location.search(getKeyPrefix('page'), null);
                vm.request.params = {
                    sort: sort,
                    page: 1
                };
                refreshTableRecords(true);
            }
        }

        function getParent() {
            vm.loaded = false;
            var data = {
                $componentId: vm.request.options.$componentId
            }, prefixParentKey = getKeyPrefix('parent');
            $location.search(getKeyPrefix('page'), null);
            vm.request.childId = vm.parent;
            if (vm.request.childId) {
                vm.options.isLoading = true;
                YiiSoftApiService.getItemById(vm.request.childId, vm.options)
                    .then(function(item) {
                        var parentId = item[vm.request.parentField] || null;
                        $location.search(prefixParentKey, parentId);
                        data.parentId = parentId;
                        $rootScope.$broadcast('ue:beforeParentEntitySet', data);

                        vm.request.childId = parentId;
                        refreshTableRecords(true);
                    }, function(reject) {
                        vm.options.isLoading = false;
                    });
            } else {
                $rootScope.$broadcast('ue:beforeParentEntitySet', data);
                $location.search(prefixParentKey, null);
                vm.request.parentField = null;
                vm.request.childId = null;
                refreshTableRecords(true);
            }
        }

        function switchLoaderOff() {
            vm.loaded = true;
        }

        $scope.$on('ue:parentEntitySet', function(event, request) {
            if (vm.isParentComponent(request)) {
                vm.loaded = false;
                var data = {
                    parentId: request.id,
                    $componentId: request.$componentId
                };
                $rootScope.$broadcast('ue:beforeParentEntitySet', data);
                request.childId = request.id;
                if(request.id && !isNaN(+request.id)) {
                    request.id = +request.id;
                    request.childId = request.id;
                }
                refreshTableRecords(true, request).then(function() {
                    $location.search(getKeyPrefix('parent'), request.childId);
                });
            }
        });

        function refreshTableRecords(notGoToState, request) {
            setInitialQueryParams();
            return YiiSoftApiService.getItemsList(request || vm.request, notGoToState);
        }


        $scope.$on('ue:beforeParentEntitySet', function(event, data) {
            if (vm.isParentComponent(data)) {
                vm.parent = data.parentId;
            }
        });

        $scope.$on('ue:collectionRefresh', function(event, data) {
            if (vm.isComponent(data)) {
                refreshTableRecords();
            }
        });

        $scope.$on('ue:afterEntityUpdate', function(event, data) {
            if (vm.isComponent(data) && data.value) {
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
        $scope.$on('ue:afterEntityDelete', function(event, data) {
            if (vm.isComponent(data)) {
                vm.items.forEach(function(item, i, arr) {
                    if (item[vm.idField] == data.entityId) {
                        arr.splice(i, 1);
                    }
                });
                vm.parent = $location.search()[getKeyPrefix('parent')] || null;
                vm.request.childId = vm.parent;
                refreshTableRecords(true).then(function(data) {
                    if (data.items) {
                        vm.items = data.items;
                    }
                });
            }
        });

        $scope.$on('ue:componentDataLoaded', function(event, data) {
            if (vm.isComponent(data) && !data.hasOwnProperty('$items') && !event.defaultPrevented) {
                vm.loaded = false;
                vm.items = data[itemsKey];
                if (vm.items) {
                    var components = vm.tableFields.map(function(f) { return f.component; });
                    if (angular.isObject(vm.items)) {
                        angular.forEach(vm.items, function(item, index) {
                            item.$options = {
                                $componentId: vm.$componentId,
                                regim: 'preview',
                                $dataIndex: index,
                                isSendRequest: true
                            };
                        });
                    }
                    var options = {
                        data: vm.items,
                        components: components,
                        $id: vm.$componentId,
                        standart: vm.dataSource.standart
                    };
                    YiiSoftApiService.extendData(options).then(function(data) {
                        var eventObject = {
                            editorEntityType: 'exist',
                            $componentId: vm.$componentId,
                            $items: data
                        };
                        $timeout(function() {
                            $rootScope.$broadcast('ue:componentDataLoaded', eventObject);
                        });
                    }).finally(switchLoaderOff);

                    vm.parentButton = !!vm.parent;
                    vm.pageItemsArray = [];

                    angular.forEach(vm.listFooterBar, function(control) {
                        control.paginationData = data;
                    });
                }
            }
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