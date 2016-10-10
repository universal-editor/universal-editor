(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonServiceController',UeButtonServiceController);

    UeButtonServiceController.$inject = ['$rootScope','$scope','$element','EditEntityStorage','RestApiService', 'ModalService', '$state'];

    function UeButtonServiceController($rootScope,$scope,$element,EditEntityStorage,RestApiService, ModalService, $state){
        var vm = this;
        var action = vm.setting.component.settings.action;
        var type = vm.setting.type;
        var request;
        if(vm.setting.component.settings.request) {
            request = JSON.parse(vm.setting.component.settings.request);
        }

        vm.label = vm.setting.component.settings.label;
        vm.processing = RestApiService.isProcessing;
        vm.entityId = vm.setting.entityId;
        if(action === 'delete') {
            vm.disabled = $state.params.pk === 'new' || !$state.params.pk;
        }

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function () {
            watchRest();
        };

        $element.bind("click", function () {
            if (vm.processing || vm.disabled) {
                return;
            }
            switch (action) {
                case 'save':
                    if (type == 'create') {
                        EditEntityStorage.editEntityUpdate("create");
                        ModalService.close();
                    } else if (type == 'update') {
                        RestApiService.editedEntityId = vm.entityId;
                        EditEntityStorage.editEntityUpdate("update");
                        ModalService.close();
                    }
                    break;
                case 'delete':
                    if(confirm("Удалить запись «" + vm.entityId + "»?")){
                        RestApiService.deleteItemById(vm.entityId, request, $scope.entityType, vm.setting);
                        ModalService.close();
                    }
                    break;
                case 'presave':
                    RestApiService.editedEntityId = vm.entityId;
                    EditEntityStorage.editEntityPresave(request);
                    break;
            }
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();
