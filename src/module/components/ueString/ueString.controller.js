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
        var regEmail = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);

        if (vm.contentType == 'password') {
            vm.typeInput = 'password';
        }

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
                var patternError = 'Введенное значение не соответствует паттерну ' + vm.pattern.toString();
                if (vm.error.indexOf(patternError) < 0) {
                    vm.error.push(patternError);
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

            if ((vm.contentType == 'email') && !val.match(regEmail)) {
                var emailError = 'Введен некорректный email.';
                if (vm.error.indexOf(emailError) < 0) {
                    vm.error.push(emailError);
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