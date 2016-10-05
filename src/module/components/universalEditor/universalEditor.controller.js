(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UniversalEditorController',UniversalEditorController);

    UniversalEditorController.$inject = ['$scope','$rootScope','configData','RestApiService', '$element', '$compile', 'component', 'menu', 'type'];

    function UniversalEditorController($scope,$rootScope,configData,RestApiService, $element, $compile, component, menu, type){
        var vm = this;
        vm.entity = RestApiService.getEntityType();
        vm.configData = configData;
        vm.menu = menu;
        vm.type = type;

        $rootScope.$broadcast('editor:set_entity_type', component.settings);
        RestApiService.setEntityType(type);

        var element = $element.find('.universal-editor');
        var scope = $scope.$new();
        scope.settings = {};
        scope.settings.component = component;
        element.append($compile('<' + component.name + ' data-setting="settings"></' + component.name + '>')(scope));
    }
})();
