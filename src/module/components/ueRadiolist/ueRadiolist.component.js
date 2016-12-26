(function () {
    'use strict';

    var ueRadiolist = {
         bindings : {
            setting: '<',
            options: '='
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