(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonTargetBlankController',EditorButtonTargetBlankController);

    EditorButtonTargetBlankController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$http'];

    function EditorButtonTargetBlankController($rootScope, $scope, $element, RestApiService, configData, $http) {
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse($scope.buttonRequest);
        } catch(e){

        }
        vm.class = $scope.buttonClass;
        vm.label = $scope.buttonLabel;
        $element.bind("click", function () {
            var url = request.url;
            for (var key in $scope.itemValue) {
                if ($scope.itemValue[key]) {
                    url = url.replace(":" + key, $scope.itemValue[key]);
                }
            }
            window.open(url, '_blank');
            
        }); 
    }
})();
