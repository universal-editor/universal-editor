(function () {
    'use strict';

    var ueRadiolist = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueRadiolist/ueRadiolist.html');
        }],
        controller: 'UeRadiolistController',
        controllerAs : 'vm'
    };

    /**
     * @desc Radiolist-type field.
     * @example <ue-radiolist></ue-radiolist>
     */
    angular
        .module('universal.editor')
        .component('ueRadiolist', ueRadiolist);
})();