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
        var request = {};
        if(vm.setting.component.settings.request) {
            request = JSON.parse(vm.setting.component.settings.request);
        }

        vm.label = vm.setting.component.settings.label;
        vm.entityId = vm.setting.entityId;
        
        var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
        var pk = $state.params[pkKey];
        if(action === 'delete') {
            vm.disabled = pk === 'new' || !pk;
        }
        request.options = vm.options;

        $element.bind("click", function () {
            if (vm.options.isLoading || (vm.disabled && vm.setting.buttonClass !== 'context')) {
                return;
            }
            switch (action) {
                case 'save':
                    if (type == 'create') {
                        EditEntityStorage.editEntityUpdate("create", request);
                        ModalService.close();
                    } else if (type == 'update') {
                        RestApiService.editedEntityId = vm.entityId;
                        EditEntityStorage.editEntityUpdate("update", request);
                    }
                    break;
                case 'delete':
                    if(confirm("Удалить запись «" + vm.entityId + "»?")){
                        request.entityId = vm.entityId;
                        request.entityType = $scope.entityType;
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
                    newRequest.id = vm.setting.entityId;
                    newRequest.options = vm.options;
                    newRequest.url = vm.setting.url;
                    newRequest.parentField = vm.setting.parentField;
                    newRequest.headComponent = vm.setting.headComponent;
                    RestApiService.loadChilds(newRequest);
                    break;
            }
        });

       $scope.$on("editor:presave_entity_created", function(event, data) {
         if(!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
           if(action === 'delete') {
               vm.disabled = false;
           }
         }
       });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();
