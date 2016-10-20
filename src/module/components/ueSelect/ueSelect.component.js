(function () {
    'use strict';

    var ueSelect = {
         bindings : {
            setting: '=',
            filter: '=',
            filterParameters: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueSelect/ueSelect.html');
        }],
        controller: 'UeSelectController',
        controllerAs : 'vm'
    };

    /**
     * @desc Select-type field.
     * @example <ue-select></ue-select>
     */
    angular
        .module('universal.editor')
        .component('ueSelect',ueSelect);
})();