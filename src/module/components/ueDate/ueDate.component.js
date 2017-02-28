(function () {
    'use strict';

    var ueDate = {
         bindings : {
            setting: '<',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueDate/ueDate.html');
        }],
        controller: 'UeDateController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-date></ue-date>
     */
    angular
        .module('universal-editor')
        .component('ueDate',ueDate);
})();