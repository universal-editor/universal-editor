(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('ComponentWrapperController', ComponentWrapperController);

    function ComponentWrapperController($element, $scope, ComponentBuilder, $timeout) {
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
            var scope = this;
            while (scope) {
                if (scope.vm && scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.settings) {
                    let settings = scope.vm.setting.component.settings;
                    if(settings.dataSource === false) {
                        return null;
                    }
                    if (settings.dataSource) {
                        return settings.dataSource;
                    }
                }
                scope = scope.$parent;
            }
            return {};
        };

        this.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
            var elem = new ComponentBuilder($scope).build();
            $element.addClass('component-wrapper');
            $timeout(function() {
                if ($scope.setting.inline) {
                    $element.closest('.component-wrapper').addClass('ue-component-inline');
                }
            });
            $element.append(elem);
        };
    }
})();
