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

            scope.inputFocus = function() {
                if (!scope.vm.multiple) {
                    elem.find('.autocomplete-field-search').removeClass('hidden');
                    elem.find('.autocomplete-item').addClass('opacity-item');
                }
                elem.find('input')[0].focus();
            };

            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
