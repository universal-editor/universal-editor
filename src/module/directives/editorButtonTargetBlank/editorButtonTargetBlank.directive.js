(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonTargetBlank',editorButtonTargetBlank);

    editorButtonTargetBlank.$inject = ['$templateCache','RestApiService','configData'];

    function editorButtonTargetBlank($templateCache,RestApiService,configData){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonTargetBlank/editorButtonTargetBlank.html'),
            scope : {
                itemValue : "=",
                buttonLabel : "@",
                buttonRequest : "@",
                index: "@",
                buttonClass: "@"
            },
            controller : 'EditorButtonTargetBlankController',
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
