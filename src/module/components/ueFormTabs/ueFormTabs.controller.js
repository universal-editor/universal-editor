(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormTabsController', UeFormTabsController);

    UeFormTabsController.$inject = ['$scope','$rootScope','configData','RestApiService','FilterFieldsStorage','$location',
                                '$document','$timeout','$httpParamSerializer','$state','toastr', '$translate', 'ConfigDataProvider', 
                                'ModalService', 'EditEntityStorage'];

    function UeFormTabsController($scope,$rootScope,configData,RestApiService,FilterFieldsStorage,$location,
                              $document,$timeout,$httpParamSerializer,$state,toastr, $translate, ConfigDataProvider, 
                              ModalService, EditEntityStorage) {
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
        vm.tableFields = [];
        vm.links = [];
        vm.errors = [];
        vm.notifys = [];
        vm.tabsVisibility = [];
        vm.currentTab = vm.setting.component.settings.tabs[0].label;
        vm.entityId = "";
        vm.editorEntityType = "new";

        vm.activateTab = function(tab) {
            vm.currentTab = tab.label;
        };


        var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
        var pk = $state.params[pkKey];     

        angular.forEach(vm.setting.component.settings.tabs, function(tab) {
            var newTab = {};
            newTab.label = tab.label;
            newTab.fields = [];
            angular.forEach(tab.fields, function(field) {
                if(angular.isString(field)) {
                    var newField = vm.setting.component.settings.dataSource.fields.filter(function(k) {
                        return k.name == field;
                    });
                    if(newField.length > 0) {
                        newTab.fields.push(newField[0]);
                    }
                } else {
                    if(field.component.settings.dataSource === undefined) {
                        field.component.settings.dataSource = vm.setting.component.settings.dataSource;
                    }
                    newTab.fields.push(field);
                }
            });
            vm.tabs.push(newTab);
        });


        $scope.$on('editor:server_error', function (event,data) {
            vm.errors.push(data);
        });


        $scope.$on('editor:field_error', function (event,data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function (event,data) {
            vm.errors = [];
            vm.notifys = [];
        });
        

    }
})();