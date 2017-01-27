(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonLinkController', UeButtonLinkController);

    UeButtonLinkController.$inject = ['$scope', '$element', '$state', '$location', 'EditEntityStorage', 'ModalService', '$timeout', '$controller', '$window', '$httpParamSerializerJQLike', '$translate'];

    function UeButtonLinkController($scope, $element, $state, $location, EditEntityStorage, ModalService, $timeout, $controller, $window, $httpParamSerializerJQLike, $translate) {
        $element.addClass('ue-button');

        var vm = this,
            state,
            url;

        vm.$onInit = function() {
            angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));
            var back = vm.setting.component.settings.back === true;
            state = vm.setting.component.settings.state;
            url = vm.setting.component.settings.url;
            vm.entityId = vm.entityId || 'new';
            vm.setting.buttonClass = vm.setting.buttonClass || 'default';
            vm.click = click;
        };

        function click() {
            var stateOptions = {
                reload: true
            };

            if (vm.options.isLoading) {
                return;
            }

            var searchString = $location.search();
            if (searchString.back) {
                state = searchString.back;
            }

            if (!state && url) {
                if (angular.isString(url)) {
                    ModalService.options = vm.options;
                    url = url.replace(':pk', vm.entityId);
                    var isReload = !~url.indexOf($location.path());
                    var params = $location.search();
                    params.back = $state.current.name;
                    var searchParams = $httpParamSerializerJQLike(params);
                    if (searchParams) {
                        searchParams = '?' + searchParams;
                    }
                    $window.location.href = url + searchParams;
                    if (isReload) {
                        $window.location.reload();
                    }
                }
            } else {
                var pkKey = 'pk';
                var params = {};
                params[pkKey] = vm.entityId;
                if (state) {
                    if (!!vm.options && !!vm.options.back) {
                        searchString.back = EditEntityStorage.getStateConfig().name;
                    }
                }
                searchString.back = $state.current.name;
                $state.go(state, params, stateOptions).then(function() {
                    $location.search(searchString);
                    $timeout(function() {
                        var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
                        if (pk === 'new' && !ModalService.isModalOpen()) {
                            EditEntityStorage.newSourceEntity(vm.options.$parentComponentId, vm.setting.component.settings.dataSource.parentField);
                        }
                    }, 0);
                });
            }
        }

        vm.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };
    }
})();

