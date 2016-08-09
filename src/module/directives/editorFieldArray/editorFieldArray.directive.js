(function () {
    'use strict';

    /**
     * @desc Array-type field.
     * @example <div editor-field-array=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldArray',editorFieldArray);

    editorFieldArray.$inject = ['$templateCache'];

    function editorFieldArray($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            transclude : true,
            template : $templateCache.get('module/directives/editorFieldArray/editorFieldArray.html'),
            controller: 'EditorFieldArrayController',
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