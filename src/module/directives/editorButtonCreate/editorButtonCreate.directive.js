(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonCreate',editorButtonCreate);

    editorButtonCreate.$inject = ['$templateCache','RestApiService'];

    function editorButtonCreate($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonCreate/editorButtonCreate.html'),
            scope : {
                buttonLabel : "@",
                buttonParams : "@",
                type : '='
            },
            controller : 'EditorButtonCreateController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
