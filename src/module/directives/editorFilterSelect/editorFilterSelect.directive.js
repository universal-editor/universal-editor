(function () {
    'use strict';

    /**
     * @desc Checkbox-type filter.
     * @example <div editor-filter-checkbox=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterSelect',editorFilterSelect);

    editorFilterSelect.$inject = ['$templateCache'];

    function editorFilterSelect($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterSelect/editorFilterSelect.html'),
            controller: 'EditorFilterSelectController',
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
