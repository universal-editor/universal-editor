(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('filterWrapper',filterWrapper);

    filterWrapper.$inject = ['$templateCache','FilterBuilder','configData','RestApiService'];

    function filterWrapper($templateCache,FilterBuilder,configData,RestApiService){
        return {
            restrict : 'A',
            replace : true,
            scope : {
                filterName : '@',
            },
            template : $templateCache.get('module/directives/filterWrapper/filterWrapper.html'),
            controller: 'FilterWrapperController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });

            elem.ready(function () {
                elem.find("input").bind("keydown", function (event) {
                    if(event.which == 13){
                        event.preventDefault();
                        //TODO
                        //editorController.applyFilter();
                    }
                });
            });

            var entityObject = RestApiService.getEntityObject();

            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.name == scope.filterName){
                        scope.filter = field;
                        return;
                    }
                });
            });

            elem.append(new FilterBuilder(scope).build());
        }
    }
})();
