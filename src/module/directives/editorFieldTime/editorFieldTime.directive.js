(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-time=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldTime',editorFieldTime);

    editorFieldTime.$inject = ['$templateCache'];

    function editorFieldTime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldTime/editorFieldTime.html'),
            controller: 'EditorFieldTimeController',
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