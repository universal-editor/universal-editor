(function () {
    'use strict';

    var ueTable = {
        bindings : {
            setting: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueTable/ueTable.html');
        }],
        controller: 'UeTableController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-table></ue-table>
     */
    angular
        .module('universal.editor')
        .component('ueTable',ueTable);
})();