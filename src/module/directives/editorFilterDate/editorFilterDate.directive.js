(function () {
    'use strict';

    /**
     * @desc Date-type filter.
     * @example <div editor-filter-date=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterDate',editorFilterDate);

    editorFilterDate.$inject = ['$templateCache'];

    function editorFilterDate($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterDate/editorFilterDate.html'),
            controller: 'EditorFilterDateController',
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
