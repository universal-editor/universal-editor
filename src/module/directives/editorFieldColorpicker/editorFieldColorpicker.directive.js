(function () {
    'use strict';

    /**
     * @desc Colorpicker-type field.
     * @example <div editor-field-colorpicker=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldColorpicker',editorFieldColorpicker);

    editorFieldColorpicker.$inject = ['$templateCache'];

    function editorFieldColorpicker($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldColorpicker/editorFieldColorpicker.html'),
            controller: 'EditorFieldColorpickerController',
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