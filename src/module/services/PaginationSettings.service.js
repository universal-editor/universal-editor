let angular = window.angular;

function PaginationSettings($location) {
  'ngInject';

  let defaultSettings = {
      pageSizeOptions: [10, 20, 50],
      pageSize: 20
    },
    paginationSettingObjects = {};

  return {
    /**
     * Set setting of pagination for certain component.
     * @param {string} id Id of components which include uePagination
     * @param {object} settings Settings-section of the configuration of the uePagination-component
     * @param {string} prefixGrid Prefix of the page-parameter which will be used in query-parameters of the URL
     * @param {boolean} silent Enable modifying of the URL of application
     * @returns {object} Pagination settings of the component
     */
    set: function(id, settings, prefixGrid, silent = false) {
      paginationSettingObjects[id] = setPaginationSettings(settings, prefixGrid);
      setPageSizeInLocation(id, silent);
      return paginationSettingObjects[id];
    },

    /**
     * Get setting of pagination for certain component.
     * @param {string} id Id of components which include uePagination
     * @returns {object} Pagination settings of the component
     */
    get: function(id) {
      return paginationSettingObjects[id];
    },
    setPrefix: function(id, value) {
      paginationSettingObjects[id].prefixGrid = value;
      return value;
    },
    getPrefix: function(id) {
      return paginationSettingObjects[id].prefixGrid;
    },
    setPage: function(id, page) {
      paginationSettingObjects[id].page = page;
      return $location.search(getKeyPrefix(id, 'page'), page);
    },
    getPage: function(id) {
      return $location.search()[getKeyPrefix(id, 'page')];
    },
    setPerPage: function(id, perPage) {
      paginationSettingObjects[id].pageSize = perPage;
      return $location.search(getKeyPrefix(id, 'per-page'), perPage);
    },
    getPerPage: function(id) {
      return $location.search()[getKeyPrefix(id, 'per-page')];
    }
  };

  /**
   * Set the settings of pagination.
   * @param {object} newSettings Settings-section of the configuration of the uePagination-component
   * @param {string} prefixGrid Prefix of the page-parameter which will be used in query-parameters of the URL
   */
  function setPaginationSettings(newSettings, prefixGrid = '') {
    //default values
    var defaultPageSizeOptions = defaultSettings.pageSizeOptions.slice();
    var defaultPageSize = defaultSettings.pageSize;
    //new values
    var pageSizeOptions = newSettings.pageSizeOptions;
    var pageSize = newSettings.pageSize;

    var settings = {};

    if (prefixGrid) {
      settings.prefixGrid = prefixGrid;
    } else {
      settings.prefixGrid = false;
    }

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

    var locationPerPage;
    if (settings.prefixGrid) {
      locationPerPage = $location.search()[settings.prefixGrid + '-per-page'];
    } else {
      locationPerPage = $location.search()['per-page'];
    }

    if (typeof settings.pageSizeOptions === 'boolean' && !settings.pageSizeOptions) {
      settings.pageSize = defaultPageSize;
    } else if (typeof pageSizeOptions === 'undefined' && typeof pageSize == 'undefined') {
      settings.pageSize = defaultPageSize;
    } else if (locationPerPage && ifValueInArray(settings.pageSizeOptions, +locationPerPage)) {
      settings.pageSize = +locationPerPage;
    } else if ((typeof pageSize == 'string' || typeof pageSize == 'number') && ifValueInArray(settings.pageSizeOptions, +pageSize)) {
      settings.pageSize = +pageSize;
    } else {
      settings.pageSize = +settings.pageSizeOptions[0];
    }

    return settings;
  }

  /**
   * Set parameter 'per-page' in URL of application.
   * @param {string} id Id of components which include uePagination
   */
  function setPageSizeInLocation(id, silent = false) {
    if (!silent && typeof paginationSettingObjects[id].pageSizeOptions !== 'boolean' && paginationSettingObjects[id].pageSizeOptions) {
      var pageSize = paginationSettingObjects[id].pageSize;
      var key = getKeyPrefix(id, 'per-page');
      var locationpageSize = +$location.search()[key];
      if (ifValueInArray(paginationSettingObjects[id].pageSizeOptions, locationpageSize)) {
        paginationSettingObjects[id].pageSize = locationpageSize;
      } else {
        $location.search(key, pageSize);
      }
    }
  }

  function ifValueInArray(array, val) {
    if (!angular.isArray(array)) {
      return false;
    }
    var isInSettings = array.filter(function(item) {
      return +val === +item;
    });
    return isInSettings.length > 0;
  }

  /** Join prefixGrid-parameter of component with @id from settings with @key from argument*/
  function getKeyPrefix(id, key) {
    if (!key && paginationSettingObjects[id].prefixGrid) {
      return paginationSettingObjects[id].prefixGrid;
    }
    return paginationSettingObjects[id].prefixGrid ? (paginationSettingObjects[id].prefixGrid + '-' + key) : key;
  }
}

export { PaginationSettings };
