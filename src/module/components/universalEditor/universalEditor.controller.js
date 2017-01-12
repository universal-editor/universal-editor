(function () {
    'use strict';
    angular
        .module('universal.editor')
        .controller('UniversalEditorController',UniversalEditorController);

    UniversalEditorController.$inject = ['$scope','$rootScope','configData','RestApiService', '$element', '$compile', 'component', '$state', 'EditEntityStorage', '$translate', 'moment'];

    function UniversalEditorController($scope,$rootScope,configData,RestApiService, $element, $compile, component, $state, EditEntityStorage, $translate, moment){
        var vm = this;
        vm.configData = configData;
        vm.menu = [];
        var currentState = $state.current;
        var pk;
        
        $rootScope.$broadcast('editor:set_entity_type', component.settings);

        var locale = 'ru';
        if (configData.hasOwnProperty('ui') && configData.ui.hasOwnProperty('language')) {
            if (configData.ui.language.hasOwnProperty('path')) {
                $translate.use(configData.ui.language.path);
            } else if (configData.ui.language.hasOwnProperty('code')) {
                $translate.use(configData.ui.language.code);
                locale = configData.ui.language.code;
            }
        }
        moment.locale(locale);

        var element = $element.find('.universal-editor');
        var scope = $scope.$new();
        scope.settings = {};
        scope.settings.component = component;
        scope.settings.pk = pk || null;
        scope.options = {};
        element.append($compile('<' + component.name + ' data-setting="settings" data-options="options" ></' + component.name + '>')(scope));
    }
})();
