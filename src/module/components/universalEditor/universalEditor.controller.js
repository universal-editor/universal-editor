(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UniversalEditorController',UniversalEditorController);

    UniversalEditorController.$inject = ['$scope','$rootScope', '$element', '$compile', '$translate', 'moment'];

    function UniversalEditorController($scope,$rootScope, $element, $compile, $translate, moment){
        var vm = this,
            component;

        vm.$onInit = function() {
            component = angular.merge({}, vm.ueConfig.component);

            $rootScope.$broadcast('editor:set_entity_type', component.settings);

            var locale = 'ru';
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

        this.$postLink = function() {
            var element = $element.find('.universal-editor');
            var scope = $scope.$new();
            scope.settings = {};
            scope.settings.component = component;
            scope.settings.pk = null;
            scope.options = {};
            element.append($compile('<' + component.name + ' data-setting="settings" data-options="options" ></' + component.name + '>')(scope));
        };
    }
})();
