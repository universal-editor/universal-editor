(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeGridController', UeGridController);

    UeGridController.$inject = ['$scope', '$rootScope', 'configData', 'RestApiService', 'FilterFieldsStorage', '$location', '$document', '$timeout', '$httpParamSerializer', '$state', 'toastr', '$translate', 'ConfigDataProvider', '$element', '$compile', 'EditEntityStorage'];

    function UeGridController($scope, $rootScope, configData, RestApiService, FilterFieldsStorage, $location, $document, $timeout, $httpParamSerializer, $state, toastr, $translate, ConfigDataProvider, $element, $compile, EditEntityStorage) {
        $scope.entity = RestApiService.getEntityType();
        /* jshint validthis: true */
        var vm = this,
            itemsKey,
            mixEntityObject,
            url = vm.setting.component.settings.dataSource.url,
            parentField = vm.setting.component.settings.dataSource.parentField;

        vm.configData = configData;
        vm.correctEntityType = true;
        vm.entityLoaded = false;
        vm.listLoaded = false;
        vm.loadingData = true;
        vm.tableFields = [];
        vm.items = [];
        vm.links = [];
        vm.errors = [];
        vm.notifys = [];
        vm.tabsVisibility = [];
        vm.entityId = "";
        vm.editorEntityType = "new";
        vm.sortField = "";
        vm.sortingDirection = true;
        vm.pageItemsArray = [];
        vm.contextLinks = [];
        vm.listHeaderBar = [];
        vm.scopeIdParent = vm.setting.component.$id;

        vm.filterComponent = vm.setting.component.settings.header.filter;
        vm.optionsFields = { $parentScopeId: vm.scopeIdParent};

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
        vm.pagination = vm.setting.component.settings.dataSource.hasOwnProperty("pagination") ? vm.setting.component.settings.dataSource.pagination : true;
        vm.autoCompleteFields = [];
        vm.entityType = $scope.entity;
        vm.parent = null;
        vm.paginationData = [];

        vm.request = {
            isProcessing: false,
            childId: vm.parent,
            scopeIdParent: vm.scopeIdParent,
            parentField: parentField,
            url: url
        };

        if (vm.setting.headComponent) {
            vm.parent = !!$location.search().parent ? $location.search().parent : null;
        }

        if (vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')) {
            vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
        }
        itemsKey = "items";

        angular.forEach(vm.setting.component.settings.dataSource.fields, function(field) {
            if (field.component.hasOwnProperty("settings") && (vm.setting.component.settings.columns.indexOf(field.name) != -1)) {
                vm.tableFields.push({
                    field: field.name,
                    displayName: field.component.settings.label || field.name
                });
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
            })
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

        vm.getScope = function() {
            return $scope;
        };

        vm.setTabVisible = function(index, value) {
            vm.tabsVisibility[index] = value;
        };

        vm.closeEditor = function() {
            $scope.$apply(function() {
                vm.entityLoaded = false;
            });
        };
        vm.changeSortField = function(field) {
            vm.listLoaded = false;
            if (vm.sortField == field) {
                vm.sortingDirection = !vm.sortingDirection;
            } else {
                vm.sortField = field;
            }

            var sortingParam = {
                sort: vm.sortingDirection ? field : "-" + field
            };

            RestApiService.getItemsList({
                sort: vm.sortingDirection ? field : "-" + field,
                url: url,
                scopeIdParent: vm.scopeIdParent,
                parentField: parentField,
                childId: vm.parent
            });
        };


        vm.toggleContextView = function(id) {
            if (vm.contextId == id) {
                vm.contextId = undefined;
            } else {
                vm.contextId = id;
            }
        };

        vm.getParent = function() {
            vm.request.childId = vm.parent;
            vm.request.parentField = parentField;
            vm.request.headComponent = vm.setting.headComponent;
            RestApiService.loadParent(vm.request);
        };

        $scope.$on('editor:parent_id_' + vm.scopeIdParent, function(event, data) {
            vm.parent = data;
        });

        vm.toggleFilterVisibility = function() {
            if (!vm.entityLoaded) {
                vm.visibleFilter = !vm.visibleFilter;
            }
        };

        $scope.$on('editor:read_entity_' + vm.scopeIdParent, function(event) {
            RestApiService.getItemsList(vm.request);
        });

        $scope.$on('editor:items_list_' + vm.scopeIdParent, function(event, data) {

            //** behavour for modal entity
            $timeout(function() {
                if (vm.setting.pk === 'new') {
                    $element.find('.btn-create').trigger('click');
                }
            }, 0);

            if ($state.is('editor.type.new')) {
                return;
            }
            vm.listLoaded = true;
            vm.items = data[itemsKey];

            vm.autoCompleteFields.forEach(function(field) {

                if (vm.autoCompleteFields.length === 0) {
                    return;
                }

                var fieldForEdit = field.name, // ключ для замены
                    ids = [], // массив айдишников
                    paramStr = ""; // стpока json c params,
                if (fieldForEdit && field.valuesRemote && field.valuesRemote.fieldSearch) {
                    vm.items.forEach(function(item) {
                        var val = item[fieldForEdit];
                        item[fieldForEdit + "_copy"] = val;
                        item[fieldForEdit] = "";
                        if (val && ids.indexOf(val) === -1) { ids.push(val); }
                    });

                    if (ids.length) {
                        paramStr = '?filter={"' + field.valuesRemote.fieldId + '":[' + ids.join(',') + ']}';
                    }
                    RestApiService.getData(field.valuesRemote.url + paramStr).then(function(res) {
                        if (res.data.items && res.data.items.length) {
                            vm.linkedNames = res.data.items;
                            for (var i = vm.linkedNames.length; i--;) {
                                var linkItem = vm.linkedNames[i];
                                if (linkItem) {
                                    vm.items.forEach(function(item) {
                                        if (item[fieldForEdit + "_copy"] == linkItem.id) {
                                            item[fieldForEdit] = linkItem[field.valuesRemote.fieldSearch];
                                        }
                                    });
                                }
                            }
                        }
                    }, function(error) {
                        console.log(error);
                    });
                }
                if (field.values) {
                    for (var i = vm.items.length; i--;) {
                        var temp = vm.items[i][fieldForEdit];
                        vm.items[i][fieldForEdit] = field.values[temp] || temp;
                    }
                }
            });

            vm.entityLoaded = false;
            //vm.parentButton = !!$location.search().hasOwnProperty("parent");
            vm.parentButton = !!vm.parent;
            vm.pageItemsArray = [];

            angular.forEach(vm.listFooterBar, function(control) {
                control.paginationData = data;
            });

            //** behavour for modal entity
            $timeout(function() {
                if (vm.setting.pk) {
                    $('#edit_btn_' + vm.setting.pk).trigger('click');
                }
            }, 0);
        });

        $scope.$on('editor:server_error', function(event, data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:presave_entity_updated', function(event, data) {
            $translate('CHANGE_RECORDS.UPDATE').then(function(translation) {
                toastr.success(translation);
            });
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
            $translate('CHANGE_RECORDS.DELETE').then(function(translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:field_error', function(event, data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function(event, data) {
            vm.errors = [];
            vm.notifys = [];
        });

        $document.on('click', function(evt) {
            if (!angular.element(evt.target).hasClass("context-toggle")) {
                $timeout(function() {
                    vm.contextId = undefined;
                }, 0);
            }
        });


        function isInTableFields(name) {
            var index = vm.tableFields.findIndex(function(field) {
                return field.field === name;
            });

            return (index !== -1) ? true : false;
        }

        //локализация
        if (configData.hasOwnProperty("ui") && configData.ui.hasOwnProperty("language")) {
            if (configData.ui.language.search(".json") !== (-1)) {
                $translate.use(configData.ui.language);
            } else if (configData.ui.language !== 'ru') {
                $translate.use('assets/json/language/' + configData.ui.language + '.json');
            }
        }

        /*  vm.clickEnter = function(event) {
              if (event.keyCode === 13) {
                  vm.applyFilter();
              }
          };*/

        vm.$onInit = function() {
            RestApiService.setFilterParams({});
            vm.request.childId = vm.parent;
            vm.request.scopeIdParent = vm.scopeIdParent;
            vm.request.parentField = parentField;
            vm.request.url = url;
            RestApiService.getItemsList(vm.request);
        };
    }
})();