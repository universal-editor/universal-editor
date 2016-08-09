(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorFieldWysiwyg',editorFieldWysiwyg);

    editorFieldWysiwyg.$inject = ['$templateCache'];

    function editorFieldWysiwyg($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldWysiwyg/editorFieldWysiwyg.html'),
            controller: 'EditorFieldWysiwygController',
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