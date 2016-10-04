(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonCreateController',UeButtonCreateController);

    UeButtonCreateController.$inject = ['$scope','$element','EditEntityStorage','$location','$state'];

    function UeButtonCreateController($scope,$element,EditEntityStorage,$location,$state){
        var vm = this;

        vm.label = vm.setting.component.settings.label;

        var state = vm.setting.component.settings.state;

        $element.bind("click", function () {
            if($location.search().hasOwnProperty("id")){
                $location.search("id",null);
            }

            var parentId = $location.search().parent !== '' ? $location.search().parent : undefined;

            var newPageType = vm.setting.component.settings.type || $state.params.type;

            $state.go(state,{
                parent: parentId,
                type: newPageType
            });
        });

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();
