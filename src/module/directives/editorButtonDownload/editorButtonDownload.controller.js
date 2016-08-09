(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonDownloadController',EditorButtonDownloadController);

    EditorButtonDownloadController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window'];

    function EditorButtonDownloadController($rootScope,$scope,$element,RestApiService,configData, $window){
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse($scope.buttonRequest);
        } catch(e){

        }
        vm.label = $scope.buttonLabel;
        vm.class = $scope.buttonClass;
        $element.bind("click", function () {
            var url = request.url;
            for (var key in $scope.itemValue) {
                if ($scope.itemValue[key]) {
                    url = url.replace(":" + key, $scope.itemValue[key]);
                }
            }            
            location.assign(url);
        });
}})();
