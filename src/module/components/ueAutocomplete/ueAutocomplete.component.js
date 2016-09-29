(function () {
    'use strict';

    var ueAutocomplete = {
        bindings : {
            setting: '='
            //field: "=",
            //setError: "=",
            //setErrorEmpty: "=",
            //errorIndexOf: "=",
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueAutocomplete/ueAutocomplete.html');
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