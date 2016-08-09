(function () {
    'use strict';

    /**
     * @desc Datetime-type field.
     * @example <div editor-field-datetime=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldDatetime',editorFieldDatetime);

    editorFieldDatetime.$inject = ['$templateCache'];

    function editorFieldDatetime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldDatetime/editorFieldDatetime.html'),
            controller: 'EditorFieldDatetimeController',
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