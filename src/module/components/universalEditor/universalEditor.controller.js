(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UniversalEditorController', UniversalEditorController);

    function UniversalEditorController($scope, $rootScope, $element, $compile, $translate, moment, $state, $location) {
        'ngInject';
        var vm = this,
            component;

        vm.$onInit = function() {

            var ueConfig = vm.ueConfig;

            var id = 0;
            (function check(value) {
                var keys = Object.keys(value);
                for (var i = keys.length; i--;) {
                    var propValue = value[keys[i]];
                    if (keys[i] === 'component') {
                        propValue.$id = propValue.$id || getRandomId();
                        if (propValue.settings && propValue.settings.dataSource && angular.isObject(propValue.settings.dataSource)) {
                            propValue.settings.dataSource.$hash = getRandomId();
                        }
                    }
                    if (angular.isObject(propValue)) {
                        check(propValue);
                    }
                }
            })(ueConfig);

            component = ueConfig.component;

            var locale = 'en';
            if (vm.ueConfig.hasOwnProperty('ui') && vm.ueConfig.ui.hasOwnProperty('language')) {
                if (vm.ueConfig.ui.language.hasOwnProperty('path')) {
                    $translate.use(vm.ueConfig.ui.language.path);
                } else if (vm.ueConfig.ui.language.hasOwnProperty('code')) {
                    $translate.use(vm.ueConfig.ui.language.code);
                    locale = vm.ueConfig.ui.language.code;
                }
            }
            moment.locale(locale);
        };

        /**
         *
         * @returns {string} Randomly generated id
         */
        function getRandomId() {
            return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function(c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16);
                }
            );
        }

        this.$postLink = function() {
            var element = $element.find('.universal-editor');
            var scope = $scope.$new();
            scope.settings = {};
            scope.settings.component = component;
            scope.settings.pk = null;
            scope.options = {};
            element.append($compile('<component-wrapper data-setting="settings" data-options="options" ></component-wrapper>')(scope));
        };
    }
})();
