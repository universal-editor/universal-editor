(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormController', UeFormController);

    UeFormController.$inject = ['$scope','$rootScope','configData','RestApiService','FilterFieldsStorage','$location','$document','$timeout','$httpParamSerializer','$state','toastr', '$translate', 'ConfigDataProvider'];

    function UeFormController($scope,$rootScope,configData,RestApiService,FilterFieldsStorage,$location,$document,$timeout,$httpParamSerializer,$state,toastr, $translate, ConfigDataProvider) {
        $scope.entity = RestApiService.getEntityType();
        var entityObject = RestApiService.getEntityObject();
        /* jshint validthis: true */
        var vm = this,
            pageItems = 3,
            itemsKey,
            mixEntityObject;

        vm.assetsPath = '/assets/universal-editor';

        vm.configData = configData;
        vm.correctEntityType = true;
        vm.entityLoaded = false;
        vm.listLoaded = false;
        vm.loadingData = true;
        vm.tabs = [];
        //vm.tabs = vm.setting.body;
        //console.log(vm.tabs);
        vm.tableFields = [];
        vm.links = [];
        vm.errors = [];
        vm.notifys = [];
        vm.tabsVisibility = [];
        vm.currentTab = vm.setting.component.settings.body[0].component.settings.label;
        vm.entityId = "";
        vm.editorEntityType = "new";
        //vm.listHeaderBar = entityObject.listHeaderBar;
        vm.editFooterBar = vm.setting.component.settings.footer;
        vm.editFooterBarNew = [];
        vm.editFooterBarExist = [];
        vm.parentButton = false;
        vm.filterFields = [];
        vm.idField = 'id';
        vm.visibleFilter = true;
        vm.autoCompleteFields = [];
        vm.entityType = $scope.entity;

        if (!!vm.configData.ui && !!vm.configData.ui.assetsPath) {
            vm.assetsPath = vm.configData.ui.assetsPath;
        }

        if(vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')){
            vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
        }
        itemsKey = "items";

        //angular.forEach(entityObject.editFooterBar, function (editFooterBar) {
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

        //angular.forEach(vm.setting.dataSource.fields, function(field) {
         //   angular.forEach()
        //    console.log(field);
        //});

        angular.forEach(vm.setting.component.settings.body, function(tab) {
            var newTab = {};
            newTab.label = tab.component.settings.label;
            newTab.fields = [];
            angular.forEach(tab.component.settings.fields, function(field) {
                if(angular.isString(field)) {
                    var newField = vm.setting.component.settings.dataSource.fields.filter(function(k) {
                        return k.name == field;
                    });
                    if(newField.length > 0) {
                        newTab.fields.push(newField[0]);
                    }
                } else {
                    newTab.fields.push(field);
                }
            });
            vm.tabs.push(newTab);
        });

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

        vm.closeButton = function () {
            console.log("zdfvgdfv");
            vm.entityLoaded = false;
            vm.listLoaded = false;

            var params = {};
            var isReload = false;
            if($state.params.back){
                params.type = $state.params.back;
            }
            if($state.params.parent){
                params.parent = $state.params.parent;
                isReload = false;
            }
            RestApiService.getItemsList({url: vm.setting.component.settings.dataSource.url});
            $state.go('index', params, {reload: isReload});
        };

        vm.toggleFilterVisibility = function () {
            if(!vm.entityLoaded){
                vm.visibleFilter = !vm.visibleFilter;
            }
        };

        $scope.$on('editor:entity_loaded', function (event,data) {
            vm.editorEntityType = data.editorEntityType;
            vm.entityId = data[vm.idField];
            vm.entityLoaded = true;
        });

        $scope.$on('editor:server_error', function (event,data) {
            vm.errors.push(data);
        });

        if ($state.params.pk) {
            RestApiService.getItemById($state.params.pk, vm.setting.component.settings.dataSource);
        } else {
            RestApiService.getItemById(vm.setting.pk, vm.setting.component.settings.dataSource);
        }

        $scope.$on('editor:presave_entity_created', function (event,data) {
            $translate('CHANGE_RECORDS.CREATE').then(function (translation) {
                toastr.success(translation);
            });
            vm.entityId = data;
            vm.editorEntityType = "exist";
        });

        $scope.$on('editor:presave_entity_updated', function (event,data) {
            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
                toastr.success(translation);
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
        }
    }
})();