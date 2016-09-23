(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UniversalEditorController',UniversalEditorController);

    UniversalEditorController.$inject = ['typeState','$scope','$rootScope','configData','RestApiService','FilterFieldsStorage','$location','$document','$timeout','$httpParamSerializer','$state','configObject','toastr', '$translate', 'ConfigDataProvider'];

    function UniversalEditorController(typeState, $scope,$rootScope,configData,RestApiService,FilterFieldsStorage,$location,$document,$timeout,$httpParamSerializer,$state,configObject,toastr, $translate, ConfigDataProvider){
        var vm = this;
        vm.entity = RestApiService.getEntityType();
        vm.configData = configData;
    }
})();
