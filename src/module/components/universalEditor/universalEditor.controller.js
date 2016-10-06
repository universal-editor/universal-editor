(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UniversalEditorController',UniversalEditorController);

    UniversalEditorController.$inject = ['$scope','$rootScope','configData','RestApiService', '$element', '$compile', 'component', 'menu', 'type', '$state', 'EditEntityStorage'];

    function UniversalEditorController($scope,$rootScope,configData,RestApiService, $element, $compile, component, menu, type, $state, EditEntityStorage){
        var vm = this;
        vm.entity = RestApiService.getEntityType();
        vm.configData = configData;
        vm.menu = menu;
        vm.type = type;
        var currentState = $state.current;
        var pk;

        RestApiService.setEntityType(type);
        EditEntityStorage.setEntityType(type);

        if (component.name === 'ue-modal' && currentState.name.indexOf('_edit') === (currentState.name.length - 5)) {
            if ($state.params && $state.params.pk) {
                pk = $state.params.pk;
            }
            var indexState = EditEntityStorage.getIndexState();
            if (indexState) {
                currentState = indexState; 
                component = currentState.component;
            }
        }

        $rootScope.$broadcast('editor:set_entity_type', component.settings);      

        var element = $element.find('.universal-editor');
        var scope = $scope.$new();
        scope.settings = {};
        scope.settings.component = component;
        scope.settings.pk = pk || null;
        element.append($compile('<' + component.name + ' data-setting="settings" data></' + component.name + '>')(scope));
    }
})();
