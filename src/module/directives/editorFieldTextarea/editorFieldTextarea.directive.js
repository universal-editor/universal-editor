(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorFieldTextarea',editorFieldTextarea);

    editorFieldTextarea.$inject = ['$templateCache'];

    function editorFieldTextarea($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldTextarea/editorFieldTextarea.html'),
            controller: 'EditorFieldTextareaController',
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