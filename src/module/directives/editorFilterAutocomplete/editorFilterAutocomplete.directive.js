(function () {
    'use strict';

    /**
     * @desc Autocomplete-type filter.
     * @example <div editor-filter-autocomplete=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterAutocomplete',editorFilterAutocomplete);

    editorFilterAutocomplete.$inject = ['$templateCache'];

    function editorFilterAutocomplete($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterAutocomplete/editorFilterAutocomplete.html'),
            controller: 'EditorFilterAutocompleteController',
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
