(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-string=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldString',editorFieldString);

    editorFieldString.$inject = ['$templateCache'];

    function editorFieldString($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldString/editorFieldString.html'),
            controller: 'EditorFieldStringController',
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