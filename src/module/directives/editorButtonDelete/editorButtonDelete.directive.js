(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonDelete',editorButtonDelete);

    editorButtonDelete.$inject = ['$templateCache','RestApiService'];

    function editorButtonDelete($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonDelete/editorButtonDelete.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@",
                entityName : "@",
                buttonClass: "@"
            },
            controller : 'EditorButtonDeleteController',
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