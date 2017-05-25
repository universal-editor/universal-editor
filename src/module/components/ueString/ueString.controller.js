(function () {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeStringController', UeStringController);

    function UeStringController($scope, $element, EditEntityStorage, FilterFieldsStorage, $location, $controller, $timeout) {
        /* jshint validthis: true */
        'ngInject';
        var vm = this;
        var baseController;

        vm.$onInit = function() {
            baseController = $controller('FieldsController', {$scope: $scope, $element: $element});

            angular.extend(vm, baseController);
            vm.addItem = addItem;
            vm.removeItem = removeItem;

            if (vm.contentType == 'password') {
                vm.typeInput = 'password';
            }

            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(e, data) {  
                if (vm.isParentComponent(data) && !vm.options.filter && !e.defaultPrevented) {
                    $scope.onLoadDataHandler(e, data);
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