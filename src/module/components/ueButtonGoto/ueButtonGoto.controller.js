(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonGotoController',UeButtonGotoController);

    UeButtonGotoController.$inject = ['$scope','$element','RestApiService','$state', '$location', '$uibModal', 'configData', 'EditEntityStorage'];

    function UeButtonGotoController($scope,$element,RestApiService,$state, $location, $uibModal, configData, EditEntityStorage){
        var vm = this;
        var state = vm.setting.component.settings.state;
        var stateType = RestApiService.getEntityType();
        var type = vm.setting.component.settings.type ? vm.setting.component.settings.type : stateType;
        vm.label = vm.setting.component.settings.label;
        vm.processing = RestApiService.isProcessing;
        vm.entityId = vm.setting.entityId || 'new';

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function () {
            watchRest();
        };

        $element.bind("click", function () {
            var stateOptions = { 
                reload: true
            };

            if (vm.processing) {
                return;
            }

                        
            var toStateConfig = EditEntityStorage.getStateConfig(state);
            //var isChildState = toStateConfig.name !== $state.current.name && ~(toStateConfig.name.indexOf($state.current.name)); 
            var pkKey = 'pk' + EditEntityStorage.getLevelChild(toStateConfig.name);
            var params = {};
            params[pkKey] =  vm.entityId;

            if (toStateConfig){
                if(toStateConfig.component.name === 'ue-modal') {
                  stateOptions.reload = false;
                }          
            }
            
            $state.go(toStateConfig.name, params, stateOptions); 
        });

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();