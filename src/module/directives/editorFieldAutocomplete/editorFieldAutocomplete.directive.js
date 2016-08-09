(function () {
    'use strict';

    /**
     * @desc Autocomplete-type field.
     * @example <div editor-field-autocomplete=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldAutocomplete',editorFieldAutocomplete);

    editorFieldAutocomplete.$inject = ['$templateCache'];

    function editorFieldAutocomplete($templateCache){
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
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();