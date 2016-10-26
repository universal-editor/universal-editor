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
        console.log("reload!");
        
        $rootScope.$broadcast('editor:set_entity_type', component.settings); 

        var element = $element.find('.universal-editor');
        var scope = $scope.$new();
        scope.settings = {};
        scope.settings.component = component;
        scope.settings.pk = pk || null;
        scope.settings.headComponent = true;
        scope.options = {};
        element.append($compile('<' + component.name + ' data-setting="settings" data-options="options" ></' + component.name + '>')(scope));
    }
})();
