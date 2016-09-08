(function () {
    'use strict';

    /**
     * @desc Autocomplete-type filter.
     * @example <div editor-filter-autocomplete=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterAutocomplete',editorFilterAutocomplete);

    editorFilterAutocomplete.$inject = ['$templateCache', '$document'];

    function editorFilterAutocomplete($templateCache, $document){
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

            $document.on('click', function(event) {
                if (!elem.find('.filter-inner-wrapper')[0].contains(event.target)) {
                    scope.$apply(function() {
                        scope.vm.showPossible = false;
                    });

                }
            });

            scope.inputFocus = function() {
                if (!scope.vm.multiple) {
                    elem.find('.autocomplete-field-search').removeClass('hidden');
                    elem.find('.autocomplete-item').addClass('opacity-item');
                }
                scope.vm.showPossible = true;
                elem.find('input')[0].focus();
            };

            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
