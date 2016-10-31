(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonGotoController', UeButtonGotoController);

    UeButtonGotoController.$inject = ['$scope', '$element', 'RestApiService', '$state', '$location', 'configData', 'EditEntityStorage', 'ModalService', '$timeout'];

    function UeButtonGotoController($scope, $element, RestApiService, $state, $location, configData, EditEntityStorage, ModalService, $timeout) {
        var vm = this;
        var state = vm.setting.component.settings.state;
        var stateType = RestApiService.getEntityType();
        var type = vm.setting.component.settings.type ? vm.setting.component.settings.type : stateType;
        vm.label = vm.setting.component.settings.label;
        vm.entityId = vm.setting.entityId || 'new';

        $element.bind("click", function() {
            var stateOptions = {
                reload: true
            };

            if (vm.options.isLoading) {
                return;
            }

            var toStateConfig = EditEntityStorage.getStateConfig(state);
            var pkKey = 'pk' + EditEntityStorage.getLevelChild(toStateConfig.name);
            var params = {};
            params[pkKey] = vm.entityId;

            if (toStateConfig) {
                if (toStateConfig.component.name === 'ue-modal') {
                    ModalService.options = vm.options;
                    stateOptions.reload = false;
                }
            }
            var searchString = $location.search();
            $state.go(toStateConfig.name, params, stateOptions).then(function() {
                $location.search(searchString);
                $timeout(function() {
                    var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
                    if (pk === 'new') {
                        EditEntityStorage.newSourceEntity();
                    }
                }, 0);
            });
        });

        vm.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };
    }
})();