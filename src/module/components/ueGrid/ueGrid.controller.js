(function() {
    'use strict';

    angular
        .module('universal-editor')
        .value('dragOptions', {
            insertedNode: {
                index: null,
                parentNode: null,
                item: null
            }
        })
        .directive('ngTableItem', function($templateCache, $compile) {
            'ngInject';
            return {
                restrict: 'A',
                scope: {
                    item: '=',
                    componentId: '@',
                    settings: '=',
                    vm: '='
                },
                link: function(scope, element, attr) {
                    var vm = scope.vm;
                    var tr = $templateCache.get('module/components/ueGrid/template/tr.html');
                    if (vm.componentSettings.dragMode && vm.componentSettings.dragMode.dragIcon) {
                        tr += '<td class="table-cell dragIcon"> <div class="dnd-expand-item glyphicon glyphicon-align-justify dragIcon" dnd-handle> </div> </td>';
                    }
                    element.append($compile(angular.element(tr))(scope));
                    scope.$on('ue-grid:updateNodes', function(event, data) {
                        if (data) {
                            if (scope.item === data) {
                                emitLoading();
                            }
                        } else {
                            emitLoading();
                        }
                    });
                    function emitLoading() {
                        scope.$broadcast('ue:componentDataLoaded', {
                            $componentId: scope.componentId,
                            $value: scope.item
                        });
                    }
                }
            };
        })
        .controller('UeGridController', UeGridController);

    function UeGridController($scope, $templateCache, $rootScope, ApiService, FilterFieldsStorage, $location, $document, $timeout, $httpParamSerializer, $state, $translate, $element, $compile, EditEntityStorage, $controller, dragOptions) {
        /* jshint validthis: true */
        'ngInject';
        $element.addClass('ue-grid');
        var vm = this,
            itemsKey,
            mixEntityObject,
            url,
            parentField;

        vm.$postLink = function() {
            var table;
            if (angular.isObject(vm.componentSettings.dragMode)) {
                if (vm.dataSource.tree) {
                    table = angular.element($templateCache.get('module/components/ueGrid/template/tree.html'));
                    if (vm.componentSettings.dragMode.dragIcon) {
                        table.find('.row.header').append('<div class="table-cell dnd-expand-item glyphicon dragIcon"> </div>');
                    }
                } else {
                    if (vm.componentSettings.dragMode.dragIcon) {
                        table = angular.element($templateCache.get('module/components/ueGrid/template/tableDD.html'));
                        table.find('thead tr').append('<td class="table-cell dragIcon glyphicon glyphicon-align-justify"> </td>');
                        table.find('tbody tr.t-row').attr('dnd-nodrag', '');
                    }
                }
            } else {
                table = angular.element($templateCache.get('module/components/ueGrid/template/table.html'));
            }
            $element.find('.ue-grid-body.ue-component-body').append($compile(table)($scope));
        };

        vm.$onInit = function() {
            vm.$componentId = vm.setting.component.$id;
            //** Nested base controller */
            angular.extend(vm, $controller('FieldsController', { $scope: $scope, $element: $element }));
            delete vm.inputLeave;

            vm.componentSettings = vm.setting.component.settings;

            vm.dataSource = vm.setting.component.settings.dataSource;
            if (vm.dataSource.tree) {
                vm.childrenField = vm.dataSource.tree.childrenField;
                vm.childrenCountField = vm.dataSource.tree.childrenCountField;
                vm.selfField = vm.dataSource.tree.selfField;
            }

            if (!vm.componentSettings.width) {
                vm.classComponent = '.col-md-12.col-xs-12.col-sm-12.col-lg-12 clear-padding-left';
            }

            url = vm.dataSource.url;
            parentField = vm.dataSource.parentField;
            vm.loaded = false;
            vm.loadingData = true;
            vm.tableFields = [];
            vm.items = [];
            vm.errors = [];
            vm.entityId = '';
            vm.sortField = '';
            vm.sortingDirection = true;
            vm.pageItemsArray = [];
            vm.contextLinks = [];
            vm.contextLinksOrigin = [];
            vm.mixContextLinks = [];
            vm.listHeaderBar = [];
            vm.isContextMenu = (!!vm.setting.component.settings.contextMenu && (vm.setting.component.settings.contextMenu.length !== 0));
            vm.prefixGrid = undefined;
            vm.refreshTableRecords = refreshTableRecords;

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
            vm.getFieldValue = getFieldValue;
            vm.dragMode = vm.setting.component.settings.dragMode;
            vm.displayHeaderColumns = vm.componentSettings.displayHeaderColumns !== false;

            vm.mixOption = angular.merge({}, vm.options);
            vm.mixOption.isMix = true;
            vm.listFooterBar = [];
            vm.options.contextId = undefined;
            vm.idField = 'id';
            vm.parentButton = false;
            vm.pagination = vm.setting.component.settings.dataSource.hasOwnProperty('pagination') ? vm.setting.component.settings.dataSource.pagination : true;
            vm.entityType = vm.setting.component.settings.entityType;
            vm.parent = null;
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
            itemsKey = vm.componentSettings.itemsKey || 'items';

            var colSettings = vm.setting.component.settings.columns;

            if (angular.isArray(colSettings)) {
                var widthDefault = '100%';
                colSettings.forEach(function(col) {
                    var tableField, width, name, sortable;
                    if (angular.isObject(col)) {
                        width = col.width;
                        if (angular.isString(col.name)) {
                            name = col.name;
                        } else {
                            return;
                        }
                    } else if (angular.isString(col)) {
                        name = col;
                    }

                    var component = vm.setting.component.settings.dataSource.fields.filter(function(field) {
                        return name && field.name === name;
                    });
                    sortable = col.hasOwnProperty('sortable') ? col.sortable : true;

                    if (component.length) {
                        col = angular.merge({}, component[0]);
                    }
                    //col.component.settings.mode = 'preview';
                    if (angular.isObject(col)) {
                        tableField = {
                            field: col.name || null,
                            sortable: sortable,
                            displayName: col.component.settings.label || col.name,
                            component: col,
                            options: {
                                $componentId: vm.$componentId,
                                regim: 'preview'
                            }
                        };
                        width = width || widthDefault;
                        if (angular.isNumber(width)) {
                            tableField.ngStyle = { "flex-grow": Math.round(width) };
                        } else if (angular.isString(width)) {
                            tableField.ngStyle = { "width": width };
                        }
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
            vm.contextLinksOrigin = angular.copy(vm.contextLinks);

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

            vm.sortField = getFirsSortableCol();

            if (!vm.sortField) vm.sortField = vm.setting.component.settings.dataSource.sortBy;

            vm.toggleContextView = toggleContextView;
            vm.toggleContextViewByEvent = toggleContextViewByEvent;
            vm.getParent = getParent;
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
                            $timeout(function() {
                                FilterFieldsStorage.fillFilterComponent(vm.$componentId, filter);
                                FilterFieldsStorage.calculate(vm.$componentId, filterName);
                                refreshTableRecords();
                            }, 0);
                        }
                    }
                }
            });
        };
        function getFirsSortableCol() {
            for (var i = 0, len = vm.tableFields.length; i < len; i++) {
                if (vm.tableFields[i].sortable) return vm.tableFields[i].field
            }
        }
        vm.moved = function(index) {
            var disabled = angular.isFunction(vm.dragMode.dragDisable) ? vm.dragMode.dragDisable(vm.items[index], vm.items) : false;
            if (!disabled) {
                vm.items.splice(index, 1);
                if (vm.dragMode && angular.isFunction(vm.dragMode.inserted)) {
                    if (index <= dragOptions.insertedNode.index) {
                        dragOptions.insertedNode.index--;
                    }
                    vm.dragMode.inserted(event, dragOptions.insertedNode.index, dragOptions.insertedNode.item, null, vm.items);
                }
            }
        };

        vm.dragStart = function(event, item, index) {
            vm.options.$dnd = vm.options.$dnd || {};
            vm.options.$dnd.dragging = item;
            if (vm.dragMode && angular.isFunction(vm.dragMode.start)) {
                vm.dragMode.start(event, item, vm.items, null, index);
            }
        };
        vm.dragover = function(event, index, type) {
            if (vm.dragMode && angular.isFunction(vm.dragMode.over)) {
                var dragging = null;
                if (vm.options.$dnd && vm.options.$dnd.dragging) {
                    dragging = vm.options.$dnd.dragging;
                }
                vm.dragMode.over(event, dragging, null, vm.items);
            }
            return true;
        };
        vm.drop = function(item, index, event) {
            if (vm.dragMode && angular.isFunction(vm.dragMode.drop)) {
                var drop = vm.dragMode.drop(event, item, null, vm.items);
                if (drop === false) {
                    return false;
                }
                if (angular.isObject(drop)) {
                    return drop;
                }
            }
            return item;
        };

        vm.inserted = function(item, index, external, type) {
            $(".dndPlaceholder").remove();
            dragOptions.insertedNode.index = index;
            dragOptions.insertedNode.item = item;

            if (vm.dragMode && vm.dragMode.mode === 'copy' && angular.isFunction(vm.dragMode.inserted)) {
                vm.dragMode.inserted(event, index, item, null, vm.items);
            }
            vm.updateTable(item);
            fillDraggingOptions(item);
        };

        vm.updateTable = function(item) {
            return $timeout(function() {
                if (item) {
                    $scope.$broadcast('ue-grid:updateNodes', item);
                } else {
                    $scope.$broadcast('ue-grid:updateNodes');
                }
            });
        };

        vm.getContainerName = function(item, collection) {
            if (vm.dragMode && angular.isFunction(vm.dragMode.containerName)) {
                return vm.dragMode.containerName(item, collection);
            }
            if (vm.dragMode && angular.isString(vm.dragMode.containerName)) {
                return vm.dragMode.containerName;
            }
            return null;
        };

        vm.getAllowedContainers = function(item, collection) {
            if (vm.dragMode && angular.isFunction(vm.dragMode.allowedContainers)) {
                return vm.dragMode.allowedContainers(item, collection);
            }
            if (vm.dragMode && angular.isArray(vm.dragMode.allowedContainers)) {
                return vm.dragMode.allowedContainers;
            }
            return null;
        };

        vm.dragDisable = function(item, collection) {
            if (vm.dragMode && angular.isFunction(vm.dragMode.dragDisable)) {
                return vm.dragMode.dragDisable(item, collection);
            }
            if (vm.dragMode && angular.isArray(vm.dragMode.dragDisable)) {
                return vm.dragMode.dragDisable;
            }
            return null;
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

        function changeSortField(field, sortable) {
            if (field && sortable) {
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
                ApiService.getItemById(vm.request.childId, vm.options)
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
                if (request.id && !isNaN(+request.id)) {
                    request.id = +request.id;
                    request.childId = request.id;
                }
                $location.search(getKeyPrefix('parent'), request.childId);
                refreshTableRecords(true, request);
            }
        });

        function refreshTableRecords(notGoToState, request) {
            vm.loaded = false;
            request = request || vm.request;
            if (angular.isObject(request) && angular.isString(request.url)) {
                setInitialQueryParams();
                return ApiService.getItemsList(request, notGoToState);
            }
        }

        $scope.$on('ue:beforeParentEntitySet', function(event, data) {
            if (vm.isParentComponent(data)) {
                vm.parent = data.parentId;
            }
        });

        $scope.$on('ue:collectionRefresh', function(event, data) {
            refreshTableRecords();
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

        $scope.$on('ue:componentDataLoaded', componentLoadedHandler);
        function componentLoadedHandler(event, data) {
            if (vm.isComponent(data) && !event.defaultPrevented && vm.tableFields.length > 0) {
                if (!data.switchLoaderOff) {
                    vm.loaded = false;
                }
                vm.data = data[itemsKey];
                if (vm.items) {
                    var components = vm.tableFields.map(function(f) { return f.component; });
                    var options = {
                        data: vm.data,
                        components: components,
                        $id: vm.$componentId,
                        standart: vm.dataSource.standart,
                        childrenField: vm.childrenField,
                        selfField: vm.selfField
                    };
                    ApiService.extendData(options).then(function(data) {
                        vm.data = data;
                        vm.items = data;
                        if (!vm.dataSource.tree) {
                            vm.updateTable();
                            fillDraggingOptions(data);
                        }
                    }).finally(switchLoaderOff);

                    vm.parentButton = !!vm.parent;
                    vm.pageItemsArray = [];

                    angular.forEach(vm.listFooterBar, function(control) {
                        control.paginationData = data;
                    });
                }
            }
        }
        function fillDraggingOptions(items) {
            if (!angular.isArray(items) && angular.isObject(items)) {
                items = [items];
            }
            angular.forEach(items, function(item) {
                if (angular.isObject(item)) {
                    item.$disable = vm.dragDisable(item, vm.items);
                    vm.$allowed = vm.getAllowedContainers(null, vm.items);
                    item.$type = vm.getContainerName(item, vm.items);
                }
            });
        }

        function getFieldValue() {
            var output = angular.merge({}, vm.items);
            (function deleteInfo(output) {
                angular.forEach(output, function(item) {
                    if (angular.isObject(item)) {
                        delete item.$disable;
                        delete item.$allowed;
                        delete item.$type;
                        delete item.$$expand;
                        deleteInfo(item);
                    }
                });
            })(output);
            return output || [];
        }

        $document.on('click', function(evt) {
            if (!angular.element(evt.target).hasClass('context-toggle')) {
                $timeout(function() {
                    vm.options.contextId = undefined;
                }, 0);
            }
        });

        function isInTableFields(name) {
            var index = vm.tableFields.findIndex(function(field) {
                return field.field === name;
            });
            return index !== -1;
        }

        function toggleContextView(record) {
            var id = record[vm.idField];
            vm.options.styleContextMenu = {};
            if (vm.options.contextId == id) {
                vm.options.contextId = undefined;
            } else {
                vm.options.contextId = id;
            }
        }

        function toggleContextViewByEvent(record, event) {
            var id = record[vm.idField];
            var obj = {
                id: id,
                primaryKey: vm.idField,
                records: vm.items
            };
            $rootScope.$broadcast('ue-grid:contextMenu', {
                record: record,
                primaryKey: vm.idField
            });
            _filterContextMenuItem(obj);
            if (angular.isDefined(id)) {
                var node = !vm.dragMode ? $element.find('.table')[0] : event.currentTarget;
                var left = event.pageX - node.getBoundingClientRect().left;
                if (event.which === 3) {
                    vm.options.styleContextMenu = {
                        'top': event.offsetY,
                        'left': left
                    };
                    event.stopPropagation();
                    vm.options.contextId = id;
                }
            }
        }

        function _filterContextMenuItem(obj) {
            vm.contextLinks = angular.copy(vm.contextLinksOrigin);
            var result = [];
            var firstVisibleElem = false;

            angular.forEach(vm.contextLinks, function(value) {
                var showContextMenuItem = value.component.settings.useable && angular.isFunction(value.component.settings.useable) ? value.component.settings.useable(obj) : true;
                if (showContextMenuItem) {
                    if (!firstVisibleElem && value.separator) {
                        delete value.separator;
                    } else if (firstVisibleElem && !value.separator) {
                        value.separator = true;
                    }
                    result.push(value);
                    firstVisibleElem = true;
                }
            });
            vm.contextLinks = result;
        }
    }
})();