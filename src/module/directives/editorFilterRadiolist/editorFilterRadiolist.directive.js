(function () {
    'use strict';

    /**
     * @desc Radiolist-type filter.
     * @example <div editor-filter-radiolist=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterRadiolist',editorFilterRadiolist);

    editorFilterRadiolist.$inject = ['$templateCache'];

    function editorFilterRadiolist($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterRadiolist/editorFilterRadiolist.html'),
            controller: 'EditorFilterRadiolistController',
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
