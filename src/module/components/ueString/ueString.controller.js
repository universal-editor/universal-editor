(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeStringController', UeStringController);

    UeStringController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$location', '$controller'];

    function UeStringController($scope, $element, EditEntityStorage, FilterFieldsStorage, $location, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('FieldsController', {$scope: $scope});
        angular.extend(vm, baseController);
        vm.addItem = addItem;
        vm.removeItem = removeItem;

        /* Слушатель события на покидание инпута. Необходим для превалидации поля на минимальное и максимальное значение */
        vm.inputLeave = function (val) {
            vm.error = [];
            if (!val) {
                return;
            }

            if (vm.trim) {
                vm.fieldValue = vm.fieldValue.trim();
                val = val.trim();
            }

            if (vm.hasOwnProperty('maxLength') && val.length > vm.maxLength) {
                var maxError = 'Для поля превышено максимальное допустимое значение в ' + vm.maxLength + ' символов. Сейчас введено ' + val.length + ' символов.';
                if (vm.error.indexOf(maxError) < 0) {
                    vm.error.push(maxError);
                }
            }

            if (vm.hasOwnProperty('minLength') && val.length < vm.minLength) {
                var minError = 'Минимальное значение поля не может быть меньше ' + vm.minLength + ' символов. Сейчас введено ' + val.length +  ' символов.';
                if (vm.error.indexOf(minError) < 0) {
                    vm.error.push(minError);
                }
            }

            if (vm.hasOwnProperty('pattern') && !val.match(new RegExp(vm.pattern))) {
                var minError = 'Введенное значение не соответствует паттерну ' + vm.pattern.toString();
                if (vm.error.indexOf(minError) < 0) {
                    vm.error.push(minError);
                }
            }

            if (vm.hasOwnProperty('maxNumber') && val > vm.maxNumber) {
                var maxError = 'Для поля превышено максимальное допустимое значение ' + vm.maxNumber + '. Сейчас введено ' + val + '.';
                if (vm.error.indexOf(maxError) < 0) {
                    vm.error.push(maxError);
                }
            }

            if (vm.hasOwnProperty('minNumber') && val < vm.minNumber) {
                var minError = 'Минимальное значение поля не может быть меньше ' + vm.minNumber + '. Сейчас введено ' + val + '.';
                if (vm.error.indexOf(minError) < 0) {
                    vm.error.push(minError);
                }
            }
        };

        vm.listeners.push($scope.$on('editor:entity_loaded', $scope.onLoadDataHandler));

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