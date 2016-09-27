(function () {
    'use strict';

    /**
     * @desc Checkbox-type filter.
     * @example <div editor-filter-checkbox=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterCheckbox',editorFilterCheckbox);

    editorFilterCheckbox.$inject = ['$templateCache'];

    function editorFilterCheckbox($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/components/editorFilterCheckbox/editorFilterCheckbox.html'),
            controller: 'EditorFilterCheckboxController',
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
