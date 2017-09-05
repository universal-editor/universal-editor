(function () {
    'use strict';

    angular
        .module('universal-editor')
        .service('PaginationSettings', ['$location', PaginationSettings]);

    function PaginationSettings($location) {
        'ngInject';

        var defaultSettings = {
            pageSizeOptions: [10, 20, 50],
            pageSize: 20
        };
        var paginationSettingObjects = {};

        return {
            set: function (id, settings, silent) {
                return paginationSettingObjects[id] = setPaginationSettings(settings, silent);
            },
            get: function (id) {
                return paginationSettingObjects[id];
            }
        };

        /**
         * Выставляем настроки для пагинатора
         * @param settings
         */
        function setPaginationSettings(newSettings, silent = false) {
            //default values
            var defaultPageSizeOptions = defaultSettings.pageSizeOptions.slice();
            var defaultPageSize = defaultSettings.pageSize;
            //new values
            var pageSizeOptions = newSettings.pageSizeOptions;
            var pageSize = newSettings.pageSize;

            var settings = {};
            if (typeof pageSizeOptions === 'undefined') {
                settings.pageSizeOptions = defaultPageSizeOptions;
            } else if (typeof pageSizeOptions === 'boolean' && !pageSizeOptions) {
                settings.pageSizeOptions = false;
            } else if (angular.isArray(pageSizeOptions) && pageSizeOptions.length > 0) {
                settings.pageSizeOptions = pageSizeOptions;
            } else {
                console.warn('Got undocumented value in `pageSizeOptions` setting value for pagination component. Check if it type of array.');
                settings.pageSizeOptions = defaultPageSizeOptions;
            }
            if (typeof settings.pageSizeOptions === 'boolean' && !settings.pageSizeOptions) {
                settings.pageSize = defaultPageSize;
            } else if (typeof pageSizeOptions === 'undefined' && typeof pageSize == 'undefined') {
                settings.pageSize = defaultPageSize;
            } else if ((typeof pageSize == 'string' || typeof pageSize == 'number') && ifValueInArray(settings.pageSizeOptions, +pageSize)) {
                settings.pageSize = +pageSize;
            } else {
                settings.pageSize = +settings.pageSizeOptions[0];
            }

            if (!silent && typeof settings.pageSizeOptions !== 'boolean' && settings.pageSizeOptions) {
                var locationpageSize = +$location.search()['per-page'];
                if (ifValueInArray(settings.pageSizeOptions, locationpageSize)) {
                    settings.pageSize = locationpageSize;
                } else {
                    $location.search('per-page', settings.pageSize);
                }
            }

            return settings;
        }

        function ifValueInArray(array, val) {
            if (!angular.isArray(array)) {
                return false;
            }
            var isInSettings = array.filter(function (item) {
                return +val === +item;
            });
            return isInSettings.length > 0;
        }
    }
})();
