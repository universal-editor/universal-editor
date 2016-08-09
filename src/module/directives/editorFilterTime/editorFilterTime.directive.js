(function () {
    'use strict';

    /**
     * @desc Date-type filter.
     * @example <div editor-filter-date=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterTime',editorFilterTime);

    editorFilterTime.$inject = ['$templateCache'];

    function editorFilterTime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterTime/editorFilterTime.html'),
            controller: 'EditorFilterTimeController',
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
