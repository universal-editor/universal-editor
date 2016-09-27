(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UniversalEditorController',UniversalEditorController);

    UniversalEditorController.$inject = ['component','$scope','$rootScope','configData','RestApiService','FilterFieldsStorage','$location','$document','$timeout','$httpParamSerializer','$state','toastr', '$translate', 'ConfigDataProvider', '$element', '$compile'];

    function UniversalEditorController(component, $scope,$rootScope,configData,RestApiService,FilterFieldsStorage,$location,$document,$timeout,$httpParamSerializer,$state,toastr, $translate, ConfigDataProvider, $element, $compile){
        var vm = this;
        vm.entity = RestApiService.getEntityType();
        vm.configData = configData;
        var element = $element.find('.universal-editor');
        var scope = $scope.$new();
        scope.settings = component.settings;
        element.append($compile('<' + component.name + ' data-setting="settings"></' + component.name + '>')(scope));
    }
})();
