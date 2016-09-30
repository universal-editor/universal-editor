(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FieldWrapperController',FieldWrapperController);

    FieldWrapperController.$inject = ['$scope', 'RestApiService', 'FieldBuilder', '$timeout', '$element'];

    function FieldWrapperController($scope, RestApiService, FieldBuilder, $timeout, $element){
        var vm = this;
        vm.error = [];

        vm.fieldDisplayName = vm.setting.component.settings.label;
        vm.hint = vm.setting.hint || false;
        vm.required = vm.setting.required || false;

        vm.isArray = (vm.setting.type == 'ue-array');

        vm.setting.setError = function(error) {
            vm.error.push(error);
        };

        vm.setting.setErrorEmpty = function() {
            vm.error = [];
        };

        vm.setting.errorIndexOf = function(error) {
            return vm.error.indexOf(error);
        };
        $scope.setting = vm.setting;
        vm.$postLink = function() {
            var element = $element.find('.field-element');
            $element.on('$destroy', function () {
                $scope.$destroy();
            });

            $timeout(function () {
                element.addClass("field-wrapper-" + $scope.setting.component.name);
            },0);

            element.append(new FieldBuilder($scope).build());
        }
    }
})();