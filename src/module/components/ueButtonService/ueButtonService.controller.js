(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonServiceController',UeButtonServiceController);

    UeButtonServiceController.$inject = ['$rootScope','$scope','$element','EditEntityStorage','RestApiService', 'ModalService', '$state', '$controller', '$location'];

    function UeButtonServiceController($rootScope,$scope,$element,EditEntityStorage,RestApiService, ModalService, $state, $controller, $location){
        $element.addClass('ue-button');

        var vm = this,
            request = {},
            pkKey,
            pk;

        vm.$onInit = function() {
            angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));

            if(vm.setting.component.settings.request) {
                request = JSON.parse(vm.setting.component.settings.request);
            }

            pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
            pk = $state.params[pkKey];
            if(vm.action === 'delete') {
                vm.disabled = pk === 'new' || !pk;
            }

            request.options = vm.options;
        };

        $element.bind('click', function () {
            if (vm.options.isLoading || (vm.disabled && vm.setting.buttonClass !== 'context')) {
                return;
            }
            switch (vm.action) {
                case 'save':
                    if (vm.type == 'create') {
                        EditEntityStorage.editEntityUpdate('create', request);
                    } else if (vm.type == 'update') {
                        RestApiService.editedEntityId = vm.entityId;
                        EditEntityStorage.editEntityUpdate('update', request);
                    }
                    break;
                case 'delete':
                    if(confirm('Удалить запись «' + vm.entityId + '»?')){
                        request.entityId = vm.entityId;
                        request.setting = vm.setting;
                        RestApiService.deleteItemById(request);
                    }
                    break;
                case 'presave':
                    RestApiService.editedEntityId = vm.entityId;
                    EditEntityStorage.editEntityPresave(request);
                    break;
                case 'open':
                    var newRequest = {};
                    newRequest.id = vm.entityId;
                    newRequest.options = vm.options;
                    newRequest.url = vm.setting.url;
                    newRequest.parentField = vm.setting.parentField;
                    newRequest.headComponent = vm.setting.headComponent;
                    RestApiService.loadChilds(newRequest);
                    break;
            }
        });

        $scope.$on('editor:presave_entity_created', function(event, data) {
            if(!vm.options.isGrid && (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId)) {
                vm.entityId = data[vm.setting.component.settings.dataSource.primaryKey];
                vm.type = 'update';
                if(vm.action === 'delete') {
                    vm.disabled = false;
                }
            }
        });
    }
})();
