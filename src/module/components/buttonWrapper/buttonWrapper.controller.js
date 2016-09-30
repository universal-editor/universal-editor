(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('ButtonWrapperController',ButtonWrapperController);

    ButtonWrapperController.$inject = ['$element', '$scope', 'ButtonBuilder'];

    function ButtonWrapperController($element, $scope, ButtonBuilder){
        var vm = this;
        $scope.setting = vm.setting;
        $scope.setting.entityId = vm.entityId;
        $scope.setting.buttonClass = vm.buttonClass;
        this.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });

            $element.append(new ButtonBuilder($scope).build());
        }
    }
})();
