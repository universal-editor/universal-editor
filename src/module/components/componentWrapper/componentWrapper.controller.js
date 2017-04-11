(function () {
    'use strict';

    angular
        .module('universal-editor')
        .controller('ComponentWrapperController',ComponentWrapperController);

    function ComponentWrapperController($element, $scope, ComponentBuilder){
        'ngInject';
        var vm = this;

        vm.$onInit = function() {
            $scope.setting = vm.setting;
            $scope.setting.entityId = vm.entityId;
            $scope.setting.buttonClass = vm.buttonClass;
            $scope.options = vm.options || {};
            $scope.options.getParentElement = function() {
                return $element;
            };
        };

        $scope.__proto__.getParentDataSource = function() {
            var scope = $scope;
            while(scope) {
                if(scope.vm && scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.settings && scope.vm.setting.component.settings.dataSource) {
                    return scope.vm.setting.component.settings.dataSource;
                }
                scope = scope.$parent;
            }
            return {};
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
