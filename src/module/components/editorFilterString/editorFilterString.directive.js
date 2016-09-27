(function () {
    'use strict';

    /**
     * @desc String-type filter.
     * @example <div editor-filter-string=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterString',editorFilterString);

    editorFilterString.$inject = ['$templateCache'];

    function editorFilterString($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/components/editorFilterString/editorFilterString.html'),
            controller: 'EditorFilterStringController',
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
