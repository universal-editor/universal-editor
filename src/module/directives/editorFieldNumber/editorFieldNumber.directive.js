(function () {
    'use strict';

    /**
     * @desc number-type field.
     * @example <div editor-field-number=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldNumber',editorFieldNumber);

    editorFieldNumber.$inject = ['$templateCache'];

    function editorFieldNumber($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldNumber/editorFieldNumber.html'),
            controller: 'EditorFieldNumberController',
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