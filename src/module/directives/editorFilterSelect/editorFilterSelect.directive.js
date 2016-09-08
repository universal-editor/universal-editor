(function () {
    'use strict';

    /**
     * @desc Checkbox-type filter.
     * @example <div editor-filter-checkbox=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterSelect',editorFilterSelect);

    editorFilterSelect.$inject = ['$templateCache', '$document'];

    function editorFilterSelect($templateCache, $document){
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

            $document.on('click', function() {
                if (!elem.find('.filter-inner-wrapper')[0].contains(event.target) ) {
                    scope.$apply(function() {
                        scope.vm.isBlur()
                    });
                }
            });

            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
