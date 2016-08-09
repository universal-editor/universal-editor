(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-map=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldMap',editorFieldMap);

    editorFieldMap.$inject = ['$templateCache'];

    function editorFieldMap($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldMap/editorFieldMap.html'),
            controller: 'EditorFieldMapController',
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