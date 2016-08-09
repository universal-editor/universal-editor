(function () {
    'use strict';

    /**
     * @desc Checkbox-type field.
     * @example <div editor-field-checkbox=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldCheckbox',editorFieldCheckbox);

    editorFieldCheckbox.$inject = ['$templateCache'];

    function editorFieldCheckbox($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldCheckbox/editorFieldCheckbox.html'),
            controller: 'EditorFieldCheckboxController',
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