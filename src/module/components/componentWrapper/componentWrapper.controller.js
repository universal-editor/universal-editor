(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('ComponentWrapperController',ComponentWrapperController);

    ComponentWrapperController.$inject = ['$element', '$scope', 'ComponentBuilder'];

    function ComponentWrapperController($element, $scope, ComponentBuilder){
        var vm = this;
        $scope.setting = vm.setting;
        $scope.setting.entityId = vm.entityId;
        $scope.setting.buttonClass = vm.buttonClass;
        $scope.filter = vm.filter || false;
        $scope.filterParameters = vm.filterParameters;
        $scope.setting.scopeIdParent = vm.scopeIdParent;
        this.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });

            $element.append(new ComponentBuilder($scope).build());
        };
    }
})();
