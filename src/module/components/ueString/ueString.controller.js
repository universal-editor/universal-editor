(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeStringController', UeStringController);

    UeStringController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$location', '$controller', '$timeout'];

    function UeStringController($scope, $element, EditEntityStorage, FilterFieldsStorage, $location, $controller, $timeout) {
        /* jshint validthis: true */
        var vm = this;
        var baseController;

        vm.$onInit = function() {
            baseController = $controller('FieldsController', {$scope: $scope});

            angular.extend(vm, baseController);
            vm.addItem = addItem;
            vm.removeItem = removeItem;

            if (vm.contentType == 'password') {
                vm.typeInput = 'password';
            }

            vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
                $scope.onLoadDataHandler(e, data);
                if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
                    vm.equalPreviewValue();
                }
            }));
        };

        function removeItem(index) {
            if (angular.isArray(vm.fieldValue)) {
                vm.fieldValue.forEach(function (value, key) {
                    if (key == index) {
                        vm.fieldValue.splice(index, 1);
                    }
                });
            }
        }

        function addItem() {
            vm.fieldValue.push('');
        }
    }
})();