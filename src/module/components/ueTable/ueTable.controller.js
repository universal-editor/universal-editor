(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeTableController', UeTableController);

    UeTableController.$inject = ['$scope','$rootScope','configData','RestApiService','FilterFieldsStorage','$location','$document','$timeout','$httpParamSerializer','$state','toastr', '$translate', 'ConfigDataProvider', '$element', '$compile'];

    function UeTableController($scope,$rootScope,configData,RestApiService,FilterFieldsStorage,$location,$document,$timeout,$httpParamSerializer,$state,toastr, $translate, ConfigDataProvider, $element, $compile) {
        $scope.entity = RestApiService.getEntityType();

            //RestApiService.getEntityObject();
        /* jshint validthis: true */
        var vm = this,
            pageItems = 3,
            metaKey,
            itemsKey,
            mixEntityObject;

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
        vm.contextLinks = vm.setting.component.settings.contextMenu;
        vm.listHeaderBar = vm.setting.component.settings.header;
        //vm.contextLinks = [
        //    {
        //        "label": "Раскрыть",
        //        "type": "open"
        //    },
        //    {
        //        "label": "Редактировать",
        //        "type": "edit"
        //    },
        //    {
        //        "label": "Удалить",
        //        "type": "delete"
        //    }
        //];
        vm.editFooterBarNew = [];
        vm.editFooterBarExist = [];
        vm.contextId = undefined;
        vm.idField = 'id';
        vm.parentButton = false;
        vm.filterFields = [];
        vm.visibleFilter = true;
        vm.pagination = vm.setting.component.settings.dataSource.hasOwnProperty("pagination") ? vm.setting.component.settings.dataSource.pagination : true;
        vm.autoCompleteFields = [];
        vm.entityType = $scope.entity;

        if(vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')){
            vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
        }

        //var mixEntity = RestApiService.getMixModeByEntity();
        //
        //vm.isMixMode = mixEntity.existence;
        //
        //if(mixEntity.existence){
        //    vm.prependIcon = mixEntity.prependIcon || 'title';
        //    vm.subType = mixEntity.entityTypeName || "type";
        //    vm.mixEntityType = mixEntity.entity;
        //    mixEntityObject = configData.entities.filter(function (item) {
        //        return item.name === vm.mixEntityType;
        //    })[0];
        //    vm.mixedListHeaderBar = mixEntityObject.listHeaderBar;
        //    vm.mixContextLinks = mixEntityObject.contextMenu;
        //}
        vm.metaKey = false;
        metaKey = "_meta";
        itemsKey = "items";

        angular.forEach(vm.setting.component.settings.dataSource.fields, function (field) {
            if(field.component.hasOwnProperty("settings") && (vm.setting.component.settings.columns.indexOf(field.name) != -1)){
                vm.tableFields.push({
                    field : field.name,
                    displayName : field.component.settings.label || field.name
                });
            }
        });

        //angular.forEach(vm.setting.component.settings.editFooterBar, function (editFooterBar) {
        //    switch (editFooterBar.type){
        //        case 'add':
        //            vm.editFooterBarNew.push(editFooterBar);
        //            break;
        //        case 'presave':
        //            vm.editFooterBarNew.push(editFooterBar);
        //            vm.editFooterBarExist.push(editFooterBar);
        //            break;
        //        case 'update':
        //            vm.editFooterBarExist.push(editFooterBar);
        //            break;
        //        case 'delete':
        //            vm.editFooterBarExist.push(editFooterBar);
        //            break;
        //        case 'request':
        //            vm.editFooterBarNew.push(editFooterBar);
        //            vm.editFooterBarExist.push(editFooterBar);
        //            break;
        //        case 'targetBlank':
        //            vm.editFooterBarNew.push(editFooterBar);
        //            vm.editFooterBarExist.push(editFooterBar);
        //            break;
        //        case 'download':
        //            vm.editFooterBarNew.push(editFooterBar);
        //            vm.editFooterBarExist.push(editFooterBar);
        //            break;
        //    }
        //});

        //if(mixEntity.existence){
        //    angular.forEach(mixEntityObject.tabs, function (tab) {
        //        angular.forEach(tab.fields, function (field) {
        //            if(field.hasOwnProperty("list") && field.list === true && !isInTableFields(field.name) ){
        //                vm.tableFields.push({
        //                    field : field.name,
        //                    displayName : field.label || field.name
        //                });
        //            }
        //        });
        //    });
        //}

        vm.sortField = vm.setting.component.settings.dataSource.sortBy || vm.tableFields[0].field;

        vm.getScope = function(){
            return $scope;
        };

        vm.setTabVisible = function (index,value) {
            vm.tabsVisibility[index] = value;
        };

        vm.closeEditor = function () {
            $scope.$apply(function () {
                vm.entityLoaded = false;
            });
        };

        vm.applyFilter = function () {
            RestApiService.setFilterParams(FilterFieldsStorage.getFilterValue());
            RestApiService.getItemsList({url: vm.setting.component.settings.dataSource.url});
        };

        vm.clearFilter = function () {
            FilterFieldsStorage.setInitialValues();
            //RestApiService.setFilterParams({});
            //RestApiService.getItemsList({url: vm.setting.component.settings.dataSource.url});
        };


        if (!RestApiService.isProcessing) {
            vm.clearFilter();
        }

        vm.changePage = function (event, linkHref) {
            event.preventDefault();
            vm.listLoaded = false;
            var params = linkHref.split("?")[1];
            RestApiService.getItemsListWithParams(params);
        };

        vm.changeSortField = function (field) {
            vm.listLoaded = false;
            if(vm.sortField == field){
                vm.sortingDirection = !vm.sortingDirection;
            } else {
                vm.sortField = field;
            }

            var sortingParam = {
                sort : vm.sortingDirection ? field : "-" + field
            };

            RestApiService.getItemsList({
                sort : vm.sortingDirection ? field : "-" + field,
                url: vm.setting.component.settings.dataSource.url
            });
        };

        //vm.contextAction = function (button,id) {
        //    RestApiService.contextMenuAction(button,id);
        //};

        vm.toggleContextView = function (id) {
            if(vm.contextId == id){
                vm.contextId = undefined;
            } else {
                vm.contextId = id;
            }
        };

        vm.getParent = function () {
            RestApiService.loadParent($location.search().parent);
        };

        vm.toggleFilterVisibility = function () {
            if(!vm.entityLoaded){
                vm.visibleFilter = !vm.visibleFilter;
            }
        };

        $scope.$on('editor:items_list', function (event, data) {
            if ($state.is('editor.type.new')) {
                return;
            }
            vm.metaKey = true;
            vm.listLoaded = true;
            vm.items = data[itemsKey];

            if (angular.isDefined(vm.setting.component.settings.dataSource.keys)) {
                metaKey = vm.setting.component.settings.dataSource.keys.meta || metaKey;
                itemsKey = vm.setting.component.settings.dataSource.keys.items || itemsKey;
                vm.metaKey = (vm.setting.component.settings.dataSource.keys.meta != false);
            }

            vm.autoCompleteFields.forEach(function (field) {

                if (vm.autoCompleteFields.length === 0) {
                    return;
                }

                var fieldForEdit = field.name, // ключ для замены
                    ids = [], // массив айдишников
                    paramStr = ""; // стpока json c params,
                if (fieldForEdit && field.valuesRemote && field.valuesRemote.fieldSearch) {
                    vm.items.forEach(function (item) {
                        var val = item[fieldForEdit];
                        item[fieldForEdit + "_copy"] = val;
                        item[fieldForEdit] = "";
                        if (val && ids.indexOf(val) === -1) { ids.push(val); }
                    });

                    if (ids.length) {
                        paramStr = '?filter={"' + field.valuesRemote.fieldId + '":[' + ids.join(',') + ']}';
                    }
                    RestApiService.getData(field.valuesRemote.url + paramStr).then(function (res) {
                        if (res.data.items && res.data.items.length) {
                            vm.linkedNames = res.data.items;
                            for (var i = vm.linkedNames.length; i--;) {
                                var linkItem = vm.linkedNames[i];
                                if (linkItem) {
                                    vm.items.forEach(function (item) {
                                        if (item[fieldForEdit + "_copy"] == linkItem.id) {
                                            item[fieldForEdit] = linkItem[field.valuesRemote.fieldSearch];
                                        }
                                    });
                                }
                            }
                        }
                    }, function (error) {
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
            vm.parentButton = !!$location.search().hasOwnProperty("parent");

            vm.pageItemsArray = [];

            var startIndex;
            var endIndex;
            var qParams = RestApiService.getQueryParams();
            // PAGINATION
            if(vm.items.length === 0){
                vm.metaKey = false;
            }
            if(vm.pagination && vm.metaKey){

                vm.metaData = data[metaKey];
                vm.metaData.fromItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage ) + 1;
                vm.metaData.toItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage ) + data[itemsKey].length;

                if(data[metaKey].currentPage > 1){
                    qParams.page = 1;
                    vm.pageItemsArray.push({
                        label : "<<",
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });

                    qParams.page = data[metaKey].currentPage - 1;
                    vm.pageItemsArray.push({
                        label : "<",
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if(data[metaKey].currentPage > pageItems + 1){
                    qParams.page = data[metaKey].currentPage - pageItems - 1;
                    vm.pageItemsArray.push({
                        label : "...",
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if( data[metaKey].currentPage - pageItems > 0){
                    startIndex = data[metaKey].currentPage - pageItems;
                } else {
                    startIndex = 1;
                }

                while(startIndex < data[metaKey].currentPage){
                    qParams.page = startIndex;
                    vm.pageItemsArray.push({
                        label : startIndex,
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });

                    startIndex++;
                }

                vm.pageItemsArray.push({
                    label : data[metaKey].currentPage,
                    self : true
                });

                if( data[metaKey].currentPage + pageItems < data[metaKey].pageCount){
                    endIndex = data[metaKey].currentPage + pageItems;
                } else {
                    endIndex = data[metaKey].pageCount;
                }

                var tempCurrentPage = data[metaKey].currentPage + 1;

                while(tempCurrentPage <= endIndex){
                    qParams.page = tempCurrentPage;
                    vm.pageItemsArray.push({
                        label : tempCurrentPage,
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });

                    tempCurrentPage++;
                }

                if(data[metaKey].currentPage + pageItems < data[metaKey].pageCount){
                    qParams.page = data[metaKey].currentPage + pageItems + 1;
                    vm.pageItemsArray.push({
                        label : "...",
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if(data[metaKey].currentPage < data[metaKey].pageCount){
                    qParams.page = data[metaKey].currentPage + 1;
                    vm.pageItemsArray.push({
                        label : ">",
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });

                    qParams.page = data[metaKey].pageCount;
                    vm.pageItemsArray.push({
                        label : ">>",
                        href : vm.setting.component.settings.dataSource.url + "?" + $httpParamSerializer(qParams)
                    });
                }
            }

            //END PAGINATION
        });

        $scope.$on('editor:server_error', function (event,data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:presave_entity_updated', function (event,data) {
            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:parent_childs', function (event,data) {
            angular.forEach(vm.items,function (item,ind){

                var startInd = 1;
                if(item[vm.idField] === data.id){
                    if(item.isExpand === true){
                        item.isExpand = false;
                        vm.items.splice(ind + 1,data.childs.length);
                    } else {
                        item.isExpand = true;
                        angular.forEach(data.childs,function (newItem) {
                            if(vm.items[ind].hasOwnProperty.parentPadding){
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

        $scope.$on('editor:entity_success_deleted', function (event,data) {
            $translate('CHANGE_RECORDS.DELETE').then(function (translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:field_error', function (event,data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function (event,data) {
            vm.errors = [];
            vm.notifys = [];
        });

        $document.on('click', function (evt) {
            if(!angular.element(evt.target).hasClass("context-toggle")){
                $timeout(function () {
                    vm.contextId = undefined;
                },0);
            }
        });

        $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (processingStatus) {
            vm.loadingData = processingStatus;
        });

        function isInTableFields(name) {
            var index = vm.tableFields.findIndex(function(field) {
                return field.field === name;
            });

            return (index !== -1) ? true : false;
        }

        //локализация
        if(configData.hasOwnProperty("ui") &&  configData.ui.hasOwnProperty("language")) {
            if(configData.ui.language.search(".json") !== (-1)){
                $translate.use(configData.ui.language);
            } else if(configData.ui.language !== 'ru') {
                $translate.use('assets/json/language/' + configData.ui.language + '.json');
            }
        }

        vm.clickEnter = function(event){
            if(event.keyCode === 13){
                vm.applyFilter();
            }
        };

        vm.$onInit = function() {
            RestApiService.setFilterParams({});
            RestApiService.getItemsList({url: vm.setting.component.settings.dataSource.url});
        };
    }
})();