(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonEditController',UeButtonEditController);

    UeButtonEditController.$inject = ['$scope','$element','RestApiService','$state', '$location', '$uibModal', 'configData', 'EditEntityStorage'];

    function UeButtonEditController($scope,$element,RestApiService,$state, $location, $uibModal, configData, EditEntityStorage){
        var vm = this;
        var params;
        var request;


        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

        vm.processing = RestApiService.isProcessing;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function() {
            watchRest();
        };

        vm.label = vm.setting.component.settings.label;
        $element.prop('id', 'edit_btn_' + vm.setting.entityId);
        $element.bind("click", function(e) {
            var indexState = EditEntityStorage.getIndexState(); 
            if (vm.processing) {
                return;
            }         
            var qwe = EditEntityStorage.getEditState();

            var stateParams = {
                pk: vm.setting.entityId,
                qwe: qwe
            };  

            var stateOptions = {reload:false};
             $state.go(EditEntityStorage.getStateConfig('modal_edit').name,stateParams, stateOptions);                      
        });

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };

    }
})();