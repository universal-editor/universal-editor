(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonPresave',editorButtonPresave);

    editorButtonPresave.$inject = ['$templateCache','RestApiService'];

    function editorButtonPresave($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonPresave/editorButtonPresave.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@"
            },
            controller : 'EditorButtonPresaveController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();