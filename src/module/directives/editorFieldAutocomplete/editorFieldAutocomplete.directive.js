(function () {
    'use strict';

    /**
     * @desc Autocomplete-type field.
     * @example <div editor-field-autocomplete=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldAutocomplete',editorFieldAutocomplete);

    editorFieldAutocomplete.$inject = ['$templateCache', '$document'];

    function editorFieldAutocomplete($templateCache, $document){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldAutocomplete/editorFieldAutocomplete.html'),
            controller: 'EditorFieldAutocompleteController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){

            $document.on('click', function(event) {
                if (!elem[0].contains(event.target)) {
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