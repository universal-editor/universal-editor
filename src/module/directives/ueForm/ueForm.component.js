(function () {
    'use strict';

    var ueForm = {
        bindings : {
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueForm/ueForm.html');
        }],
        controller: 'UeFormController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-form></ue-for,>
     */
    angular
        .module('universal.editor')
        .component('ueForm',ueForm);
})();