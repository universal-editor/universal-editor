(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonAdd',editorButtonAdd);

    editorButtonAdd.$inject = ['$templateCache','RestApiService'];

    function editorButtonAdd($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonAdd/editorButtonAdd.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonParams : "@"
            },
            controller : 'EditorButtonAddController',
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