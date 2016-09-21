(function () {
    'use strict';

    var ueAutocomplete = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueAutocomplete/ueAutocomplete.html');
        }],
        controller: 'UeAutocompleteController',
        controllerAs : 'vm'
    };

    /**
     * @desc Autocomplete-type field.
     * @example <ue-autocomplete></ue-autocomplete>
     */
    angular
        .module('universal.editor')
        .component('ueAutocomplete',ueAutocomplete);
})();