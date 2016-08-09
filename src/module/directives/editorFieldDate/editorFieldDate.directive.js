(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-date=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldDate',editorFieldDate);

    editorFieldDate.$inject = ['$templateCache'];

    function editorFieldDate($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldDate/editorFieldDate.html'),
            controller: 'EditorFieldDateController',
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