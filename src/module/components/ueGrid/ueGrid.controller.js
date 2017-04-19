(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeGridController', UeGridController);

    function UeGridController($scope, $rootScope, ApiService, FilterFieldsStorage, $location, $document, $timeout, $httpParamSerializer, $state, $translate, $element, $compile, EditEntityStorage, $controller) {
        /* jshint validthis: true */
        'ngInject';
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

            vm.dragMode = vm.setting.component.settings.dragMode;
            vm.dragstart = function(event, item, index) {
                if (angular.isFunction(vm.dragMode.start)) {
                    vm.dragMode.start(event, item, vm.items);
                }
                vm.draggingEl = item;
                vm.draggingIndex = index;
            };
            vm.dragover = function(event, index, type) {
                var currentElement = $(event.target || event.srcElement).closest('tr');
                var dndPlaceholder = currentElement.closest('tbody').find('tr.dndPlaceholder td');
                if (currentElement.hasClass('row-draggable') || (currentElement.hasClass('dndPlaceholder') && currentElement.prev('tr').length === 0)) {
                    dndPlaceholder.text('Вставить элемент как соседний');
                } else {
                    dndPlaceholder.text('Вставить элемент как дочерний');
                }

                if (angular.isFunction(vm.dragMode.over)) {
                    var dest = getDestItem(event),
                        destEl;
                    if (dest.item) {
                        destEl = getItemByPrimaryKey(dest.item.$options.$dndParentId).item;
                    }
                    vm.dragMode.over(event, vm.draggingEl, destEl, vm.items);
                }

                var accordingType = !angular.isFunction(vm.dragMode.allowedTypes) || ~vm.dragMode.allowedTypes().indexOf(type);

                return (!isParent(vm.items[index], vm.draggingEl)) && accordingType;
            };

            function replaceChilds(index, oldLevel, item) {
                var childs = [];
                while (vm.items[index] && vm.items[index].$options.$level > oldLevel) {
                    childs.push(vm.items[index]);
                    vm.items.splice(index, 1);
                }
                return childs;
            }
            vm.drop = function(item, index, event) {
                if (!angular.isObject(item.$options)) {
                    let newInputs = [], entity;
                    if (vm.dataSource.selfField) {
                        entity = item[vm.dataSource.selfField];
                        entity.$frame = angular.merge({}, item);
                        delete entity.$frame[vm.dataSource.childrenField];
                    } else {
                        entity = item;
                    }
                    entity.$options = {
                        $componentId: vm.$componentId,
                        regim: 'preview',
                        isSendRequest: true,
                        $level: 1,
                        $dndParentId: null
                    };
                    newInputs.push(entity);
                    convertToTable(item, 1, newInputs);
                    angular.forEach(newInputs, function(newItem, i) {
                        vm.items.splice(vm.items.length, 0, newItem);
                    });
                }

                var currentElement = $(event.target || event.srcElement).closest('tr');
                var regimChild = currentElement.hasClass('dndPlaceholder');
                var regimNext = currentElement.hasClass('row-draggable');

                if (regimChild && currentElement.prev('tr').length === 0 && currentElement.next('tr').length > 0) {
                    regimChild = false;
                    regimNext = true;
                    currentElement = currentElement.next('tr');
                }

                var insertTop = currentElement.prev('tr.dndPlaceholder').length;
                var insertBottom = currentElement.next('tr.dndPlaceholder').length;
                if (regimNext) {
                    let key = currentElement.data().id,
                        dataElement = getItemByPrimaryKey(key),
                        oldLevel = item.$options.$level;
                    if (checkCallback(dataElement.item.$options.$dndParentId)) {
                        modifyPreviousParentChildCount(item.$options.$dndParentId);
                        item.$options.$dndParentId = dataElement.item.$options.$dndParentId;
                        item.$options.$level = dataElement.item.$options.$level;
                        if (insertTop) {
                            vm.droppedElement = { index: dataElement.index, item: item };
                        } else if (insertBottom) {
                            vm.droppedElement = { index: dataElement.index + 1, item: item };
                        }
                        let oldIndex = getItemByPrimaryKey(item[vm.dataSource.primaryKey]).index;
                        vm.items.splice(oldIndex, 1);
                        var childs = replaceChilds(oldIndex, oldLevel);
                        /** dataElement recalculate */
                        dataElement = getItemByPrimaryKey(key);
                        var dataElementChilds = replaceChilds(dataElement.index + 1, dataElement.item.$options.$level);
                        dataElement = getItemByPrimaryKey(key);
                        if (insertTop) {
                            vm.droppedElement = { index: dataElement.index, item: item };
                        } else if (insertBottom) {
                            vm.droppedElement = { index: dataElement.index + 1, item: item };
                        }
                        vm.items.splice(vm.droppedElement.index, 0, vm.droppedElement.item);
                        var newEndex = getItemByPrimaryKey(item[vm.dataSource.primaryKey]).index + 1;
                        angular.forEach(childs, function(child, i) {
                            vm.items.splice(newEndex + i, 0, child);
                            child.$options.$level += (item.$options.$level - oldLevel);
                        });

                        dataElement = getItemByPrimaryKey(key);
                        angular.forEach(dataElementChilds, function(child, i) {
                            vm.items.splice(dataElement.index + i + 1, 0, child);
                        });
                        modifyPreviousParentChildCount(item.$options.$dndParentId, true);
                    }
                }

                if (regimChild) {
                    let parentTr = currentElement.prev('tr');
                    let key = parentTr.data().id,
                        dataElement = getItemByPrimaryKey(key),
                        oldLevel = item.$options.$level;
                    if (checkCallback(dataElement.item)) {
                        modifyPreviousParentChildCount(item.$options.$dndParentId);
                        item.$options.$dndParentId = dataElement.item[vm.dataSource.primaryKey];
                        item.$options.$level = dataElement.item.$options.$level + 1;
                        let oldIndex = getItemByPrimaryKey(item[vm.dataSource.primaryKey]).index;
                        vm.items.splice(oldIndex, 1);
                        let childs = replaceChilds(oldIndex, oldLevel);
                        /** dataElement recalculate */
                        dataElement = getItemByPrimaryKey(key);
                        vm.items.splice(dataElement.index + 1, 0, item);
                        let newEndex = getItemByPrimaryKey(item[vm.dataSource.primaryKey]).index + 1;
                        angular.forEach(childs, function(child, i) {
                            vm.items.splice(newEndex + i, 0, child);
                            child.$options.$level += (item.$options.$level - oldLevel);
                        });
                        modifyPreviousParentChildCount(dataElement, true);
                    }
                }
                $timeout(function() {
                    angular.forEach(vm.items, function(item, index) {
                        item.$options.$dataIndex = index;
                    });
                    $scope.$digest();
                    vm.data.switchLoaderOff = true;
                    $rootScope.$broadcast('ue:componentDataLoaded', vm.data);
                });

                function modifyPreviousParentChildCount(key, plus) {
                    var previousParent = key;
                    if (!angular.isObject(key)) {
                        previousParent = getItemByPrimaryKey(key);
                    }
                    var childCountField = vm.dataSource.childrenCountField;
                    if (previousParent && previousParent.item) {
                        if (previousParent.item.$frame) {
                            if (plus) {
                                previousParent.item.$frame[childCountField]++;
                            } else {
                                previousParent.item.$frame[childCountField]--;
                            }
                        }
                        if (previousParent.item[childCountField]) {
                            if (plus) {
                                previousParent.item[childCountField]++;
                            } else {
                                previousParent.item[childCountField]--;
                            }
                        }
                    }
                }

                function checkCallback(parentItem) {
                    if (!angular.isObject(getItemByPrimaryKey)) {
                        parentItem = getItemByPrimaryKey(parentItem);
                    }
                    if (angular.isFunction(vm.dragMode.drop)) {
                        var drop = vm.dragMode.drop(event, item, parentItem, vm.items);
                        return !!drop;
                    }
                    return true;
                }
                /* var element = getDestItem(event);
                 var isDifferentElement = element.item[vm.dataSource.primaryKey] !== item[vm.dataSource.primaryKey];
                 if (isDifferentElement) {
                     var dataElement = element.htmlEl.data();
                     var level, parentId;
                     if (element.htmlEl.length && dataElement.id !== item[vm.dataSource.primaryKey]) {
                         level = dataElement.level;
                         parentId = dataElement.parentId;
                         var elementNext = vm.items[index];
                         if (angular.isObject(elementNext)) {
                             var levelNext = elementNext.$options.$level;
                             var parentIdNext = elementNext.$options.$dndParentId;
                             if (levelNext > level) {
                                 level = levelNext;
                                 parentId = parentIdNext;
                             }
                         }
                     }
                     if (angular.isFunction(vm.dragMode.drop)) {
                         var drop = vm.dragMode.drop(event, item, getItemByPrimaryKey(parentId), vm.items);
                         if (drop) {
                             item.$options.$dndParentId = parentId;
                             var i = vm.draggingIndex + 1;
                             var dLevel = level - item.$options.$level;
                             while (vm.items[i] && vm.items[i].$options.$level > item.$options.$level) {
                                 vm.items[i].$options.$dLevel = level - item.$options.$level;
                                 i++;
                             }
                             item.$options.$level = level;
                         }
                         return drop ? item : false;
                     }
                 }*/

                return false;
            };

            function getItemByPrimaryKey(id) {
                var i = null, output = null;
                vm.items.forEach(function(item, index) {
                    if (item[vm.dataSource.primaryKey] == id) {
                        i = index;
                        output = item;
                    }
                });
                return { item: output, index: i };
            }

            function getDestItem(event) {
                var target = $(event.target || event.srcElement).closest('tr');
                var element = $(target).closest('tr');
                if (target.hasClass('dndPlaceholder')) {
                    let next = target.next('tr');
                    if (next.length === 0) {
                        element = target.prev('tr');
                    } else {
                        element = next;
                    }
                }
                var item;
                if (element.data().id) {
                    item = vm.items.filter(function(item) {
                        return item[vm.dataSource.primaryKey] == element.data().id;
                    })[0];
                }
                return { htmlEl: element, item: item };
            }

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
                refreshTableRecords(true, request).then(function() {
                    $location.search(getKeyPrefix('parent'), request.childId);
                });
            }
        });

        function refreshTableRecords(notGoToState, request) {
            setInitialQueryParams();
            return ApiService.getItemsList(request || vm.request, notGoToState);
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

        function convertToTable(data, level, newInputs) {
            if (angular.isArray(data[vm.dataSource.childrenField]) || data[vm.dataSource.childrenCountField > 0]) {
                level++;
                angular.forEach(data[vm.dataSource.childrenField], function(item, index) {
                    var entity;
                    if (vm.dataSource.selfField) {
                        entity = item[vm.dataSource.selfField];
                        entity.$options = {
                            $componentId: vm.$componentId,
                            regim: 'preview',
                            isSendRequest: true,
                            $level: level,
                            $dndParentId: data[vm.dataSource.selfField][vm.dataSource.primaryKey]
                        };
                        entity.$frame = angular.merge({}, item);
                        delete entity.$frame[vm.dataSource.childrenField];
                    } else {
                        item.$options = {
                            $componentId: vm.$componentId,
                            regim: 'preview',
                            isSendRequest: true,
                            $level: level,
                            $dndParentId: data[vm.dataSource.primaryKey]
                        };
                        entity = item;
                    }
                    newInputs.push(entity);
                    convertToTable(item, level, newInputs);
                });
            }
        }



        function isParent(child, parent) {
            var output = false;
            if (child) {
                var childId = child[vm.dataSource.primaryKey];
                angular.forEach(parent[vm.dataSource.childrenField], function(item) {
                    if (item[vm.dataSource.primaryKey] == childId) {
                        output = true;
                    }
                    if (output === false) {
                        output = isParent(childId, item);
                    }
                });
            }
            return output;
        }

        $scope.$on('ue:componentDataLoaded', componentLoadedHandler);
        function componentLoadedHandler(event, data) {
            if (vm.isComponent(data) && !data.hasOwnProperty('$items') && !event.defaultPrevented) {
                if (!data.switchLoaderOff) {
                    vm.loaded = false;
                }
                vm.data = data;
                vm.items = data[itemsKey];
                if (vm.items) {
                    var components = vm.tableFields.map(function(f) { return f.component; });
                    if (angular.isObject(vm.items)) {
                        var newInputs = [];
                        angular.forEach(vm.items, function(item, index) {
                            var entity;
                            if (vm.dataSource.selfField) {
                                entity = item[vm.dataSource.selfField];
                                entity.$frame = angular.merge({}, item);
                                delete entity.$frame[vm.dataSource.childrenField];
                            } else {
                                entity = item;
                            }
                            entity.$options = {
                                $componentId: vm.$componentId,
                                regim: 'preview',
                                $dataIndex: index,
                                isSendRequest: true,
                                $level: 1,
                                $dndParentId: null
                            };
                            newInputs.push(entity);
                            convertToTable(item, 1, newInputs);
                        });
                        vm.items = newInputs;
                        angular.forEach(vm.items, function(item, index) {
                            item.$options.$dataIndex = index;
                        });
                    }
                    var options = {
                        data: vm.items,
                        components: components,
                        $id: vm.$componentId,
                        standart: vm.dataSource.standart
                    };
                    ApiService.extendData(options).then(function(data) {
                        var eventObject = {
                            editorEntityType: 'exist',
                            $componentId: vm.$componentId,
                            $items: data
                        };
                        $timeout(function() {
                            $rootScope.$broadcast('ue:componentDataLoaded', eventObject);
                        });
                        vm.data = eventObject;
                    }).finally(switchLoaderOff);

                    vm.parentButton = !!vm.parent;
                    vm.pageItemsArray = [];

                    angular.forEach(vm.listFooterBar, function(control) {
                        control.paginationData = data;
                    });
                }
            }
        }


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
            var left = event.pageX - $element.find('.table')[0].getBoundingClientRect().left;
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