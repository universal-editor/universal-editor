(function () {
    'use strict';

    /**
     * @desc DateTime-type filter.
     * @example <div editor-filter-datetime=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterDatetime',editorFilterDatetime);

    editorFilterDatetime.$inject = ['$templateCache'];

    function editorFilterDatetime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterDatetime/editorFilterDatetime.html'),
            controller: 'EditorFilterDateTimeController',
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
