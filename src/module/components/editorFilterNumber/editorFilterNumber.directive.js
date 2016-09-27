(function () {
    'use strict';

    /**
     * @desc String-type filter.
     * @example <div editor-filter-number=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterNumber',editorFilterNumber);

    editorFilterNumber.$inject = ['$templateCache'];

    function editorFilterNumber($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/components/editorFilterNumber/editorFilterNumber.html'),
            controller: 'EditorFilterNumberController',
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
