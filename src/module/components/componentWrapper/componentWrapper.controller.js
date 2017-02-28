(function () {
    'use strict';

    angular
        .module('universal-editor')
        .controller('ComponentWrapperController',ComponentWrapperController);

    ComponentWrapperController.$inject = ['$element', '$scope', 'ComponentBuilder'];

    function ComponentWrapperController($element, $scope, ComponentBuilder){
        var vm = this;

        vm.$onInit = function() {
            $scope.setting = vm.setting;
            $scope.setting.entityId = vm.entityId;
            $scope.setting.buttonClass = vm.buttonClass;
            $scope.options = vm.options || {};
            $scope.options.getParentElement = function() {
                return $element;
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
            var elem = new ComponentBuilder($scope).build();
            $element.addClass('component-wrapper');
            $element.append(elem);
        };
    }
})();
