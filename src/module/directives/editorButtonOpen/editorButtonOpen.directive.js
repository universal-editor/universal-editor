(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonOpen',editorButtonOpen);

    editorButtonOpen.$inject = ['$templateCache','RestApiService'];

    function editorButtonOpen($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonOpen/editorButtonOpen.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@"
            },
            controller : 'EditorButtonOpenController',
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
