(function () {
    'use strict';

    var ueTable = {
        bindings : {
            tableFields: '=',
            sortField: '=',
            sortingDirection: '=',
            changeSortField: '=',
            listLoaded: '=',
            items: '=',
            toggleContextView: '=',
            contextLinks: '=',
            contextId: '=',
            contextAction: '=',
            mixContextLinks: '=',
            mixEntityType: '=',
            prependIcon: '=',
            pageItemsArray: '=',
            metaKey: '=',
            idField: '=',
            pagination: '=',
            changePage: '='

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