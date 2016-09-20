(function () {
    'use strict';

    /**
     * @desc Autocomplete-type field.
     * @example <ue-autocomplete></ue-autocomplete>
     */
    angular
        .module('universal.editor')
        .directive('ueAutocomplete',ueAutocomplete);

    ueAutocomplete.$inject = ['$templateCache', '$document'];

    function ueAutocomplete($templateCache, $document){
        return {
            restrict : 'E',
            replace : true,
            scope : {
                field: "=",
                setError: "=",
                setErrorEmpty: "=",
                errorIndexOf: "=",
                parentField: "=",
                parentFieldIndex: "="
            },
            template : $templateCache.get('module/directives/ueAutocomplete/ueAutocomplete.html'),
            controller: 'UeAutocompleteController',
            controllerAs : 'vm',
            link : link,
            bindToController: true
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