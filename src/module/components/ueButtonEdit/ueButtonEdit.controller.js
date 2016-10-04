(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonEditController',UeButtonEditController);

    UeButtonEditController.$inject = ['$scope','$element','RestApiService','$state', '$location', '$uibModal', 'configData'];

    function UeButtonEditController($scope,$element,RestApiService,$state, $location, $uibModal, configData){
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

        var stateParams = {
            pk : vm.setting.entityId
        };

        var qwe = configData.entities[0].states[1];

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }

            var stateOptions = {};
            
            //if($scope.entitySubtype){
            //    stateParams.type = $scope.entitySubtype;
            //    stateParams.back = $state.params.type;
            //    stateOptions.reload = true;
            //} else {
            //    stateParams.type = $state.params.type;
            //}
            //if ($location.search().parent) {
            //    stateParams.parent = $location.search().parent;
            //}
            $state.go(vm.setting.component.settings.state,stateParams, stateOptions);

            //var modalInstance = $uibModal.open({
            //    component: 'ueModal',
            //    resolve: {
            //        setting: function () {
            //            return qwe;
            //        },
            //        pk: function() {
            //            return stateParams.pk;
            //        }
            //    }
            //});
            //modalInstance.result.then(function (selectedItem) {
            //    console.log(selectedItem);
            //}, function () {
            //    console.info('modal-component dismissed at: ' + new Date());
            //    $state.reload();
            //});
        });

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }

    }
})();