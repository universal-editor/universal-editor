(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonCreateController',UeButtonCreateController);

    UeButtonCreateController.$inject = ['$scope','$element','EditEntityStorage','$location','$state', '$uibModal'];

    function UeButtonCreateController($scope,$element,EditEntityStorage,$location,$state, $uibModal){
        var vm = this;

        vm.label = vm.setting.component.settings.label;

        var state = vm.setting.component.settings.state;

        $element.bind("click", function () {
            if($location.search().hasOwnProperty("id")){
                $location.search("id",null);
            }

            var parentId = $location.search().parent !== '' ? $location.search().parent : undefined;
            var newPageType = vm.setting.component.settings.type || $state.params.type;
            var indexState = EditEntityStorage.getIndexState();
            if (vm.processing) {
                return;
            }
            var qwe = EditEntityStorage.getEditState();
            var stateParams = {
                pk: 'new',
                qwe: qwe
            };  
            if (qwe.component.name === "ue-modal") {
                var modalInstance = $uibModal.open({
                    component: 'ueModal',
                    resolve: {
                        settings: function() {
                            stateParams.qwe.oldState = indexState.name;
                            return stateParams.qwe;
                        },
                        pk: function() {
                            return 'new';
                        }
                    }
                });

                $state.params.pk = 'new';

                modalInstance.result.then(function(selectedItem) {
                    console.log(selectedItem);
                }, function() {
                    console.info('modal-component dismissed at: ' + new Date());
                    if (indexState) {
                        $state.go(indexState.name, {}, { reload: false, notify: false });
                    }
                });
                $state.go(qwe.name, stateParams, { reload: false, notify: false });
            } else {
                $state.go(state, {
                    parent: parentId,
                    type: newPageType
                });
            }
        });

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();
