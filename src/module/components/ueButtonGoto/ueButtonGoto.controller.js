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
        vm.entityId = vm.setting.entityId;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function () {
            watchRest();
        };

        $element.bind("click", function () {
            var pk = vm.entityId || 'new';

            if (vm.processing) {
                return;
            }
            var toStateConfig = EditEntityStorage.getStateConfig(state);
            $state.params.pk = pk;
            $state.go(toStateConfig.name, {pk: (vm.entityId || 'new')});
        });

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();