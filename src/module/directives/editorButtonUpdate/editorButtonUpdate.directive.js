(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonUpdate',editorButtonUpdate);

    editorButtonUpdate.$inject = ['$templateCache','RestApiService'];

    function editorButtonUpdate($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonUpdate/editorButtonUpdate.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonParams : "@"
            },
            controller : 'EditorButtonUpdateController',
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