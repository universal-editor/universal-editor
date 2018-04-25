import DataSource from '../classes/dataSource.js';

function ApiService($q, $rootScope, $http, $location, MessagesService, $state, $httpParamSerializer, FilterFieldsStorage, toastr, $translate, $httpParamSerializerJQLike, $window, $injector) {
    'ngInject';
    var self = this,
        itemsKey = 'items',
        cancelerPromises = [],
        storageRemotedComponents = {};

    self.isProcessing = false;
    self.alreadyRequested = [];

    this.replaceToURL = replaceToURL;

    //Cache methods
    this.saveToStorage = saveToStorage;
    this.getFromStorage = getFromStorage;

    //For working with entities
    this.getItemsList = getItemsList;
    this.addNewItem = addNewItem;
    this.updateItem = updateItem;
    this.presaveItem = presaveItem;
    this.getItemById = getItemById;
    this.deleteItemById = deleteItemById;

    this.getUrlResource = getUrlResource;
    this.extendData = extendData;
    this.actionRequest = actionRequest;

    this.getUrlDepend = getUrlDepend;
    this.getUrlWithParams = getUrlWithParams;

    this.getCustomService = getCustomService;
    this.getAjaxOptionsByTypeService = getAjaxOptionsByTypeService;

    /**
     * Resolved the promise which cancel the requests and creates new.
     * @param {string} id id of component
     * @param {string} mode Action {read, one... }
     * @returns Deferred object
     */
    function setTimeOutPromise(id, mode = 'read') {
        let def = $q.defer(),
            timeout;
        cancelerPromises[id] = cancelerPromises[id] || {};
        timeout = cancelerPromises[id][mode];
        if (timeout) {
            timeout.resolve();
        }
        cancelerPromises[id][mode] = def;
        return def;
    }

    /**
     *  Method for reading of the collection-data from API (is used by ue-grid).
     * @param {object} request
     * @param {boolean} notGoToState If true the state is not changed.
     * @returns Promise
     */
    function getItemsList(request, notGoToState = false) {
        let deferred = $q.defer(),
            componentId = request.options.$componentId,
            config,
            httpOptions;

        request.options.isLoading = true;
        request.notGoToState = notGoToState;
        request.timeout = setTimeOutPromise(componentId);

        config = getContextAnswer('read', request);
        httpOptions = getAjaxOptionsByTypeService(config);

        if (httpOptions.url) {
            $http(httpOptions).then(
                onSuccess(config, deferred),
                onReject(config, deferred)
            ).finally(onFinally(config));
        } else {
            onFinally(config, deferred)();
        }
        return deferred.promise;
    }

    function onFinally(config, def) {
        return () => {
            initHandler(config, {},  'complete');
            if (config.options) {
                config.options.isLoading = false;
            }

            if (def) {
                def.resolve([]);
            }
        };
    }

    function onSuccess(config, deferred) {
        var data,
            service = getCustomService(config.$dataSource.standard);
        return (response) => {
            if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                data = service.processResponse(config, response, successAnswer.bind(config), failAnswer.bind(config));
            }
            deferred.resolve(data);
        }
    }

    function onReject(config, deferred) {
        var data,
            standard,
            service;
        if (config.$dataSource) {
            standard = config.$dataSource.standard;
        }
        service = getCustomService(standard);
        return (reject) => {
            if (config.timeout) {
                reject.canceled = config.timeout.promise.$$state.status === 1;
            }
            if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                reject.data = service.processResponse(config, reject, successAnswer.bind(config), failAnswer.bind(config));
            } else {
                failAnswer.bind(config)(reject);
            }
            deferred.reject(reject);
        }
    }

    /**
    * Method for creating of the entity (is used by ue-form).
    * @param {object} request
    * @returns Promise
    */
    function addNewItem(request) {
        if (request.options.isLoading) {
            return;
        }
        let deferred = $q.defer(),
            dataSource = request.options.$dataSource,
            config,
            httpOptions;

        request.options.isLoading = true;
        config = getContextAnswer('create', request);
        httpOptions = getAjaxOptionsByTypeService(config);

        $rootScope.$broadcast('ue:beforeEntityCreate', config);

        $http(httpOptions).then(
            onSuccess(config, deferred),
            onReject(config, deferred)
        ).finally(onFinally(config));
        return deferred.promise;
    }

    function removePrimaryKey(ds, data) {
        if (ds && ds.primaryKey && data && data[ds.primaryKey]) {
            delete data[ds.primaryKey];
        }
    }

    /**
    * Method for updating of the entity (is used by ue-form).
    * @param {object} request
    * @returns Promise
    */
    function updateItem(request) {

        if (request.options.isLoading) {
            return;
        }

        request.options.isLoading = true;

        let deferred = $q.defer(),
            config,
            httpOptions;

        config = getContextAnswer('update', request);
        removePrimaryKey(config.$dataSource, config.data);
        httpOptions = getAjaxOptionsByTypeService(config, { [config.$dataSource.primaryKey]: config.entityId });

        $rootScope.$broadcast('ue:beforeEntityUpdate', config);
        $http(httpOptions).then(
            onSuccess(config, deferred),
            onReject(config, deferred)
        ).finally(onFinally(config));
        return deferred.promise;
    }

    /**
    * Method for updating of the entity without reloading of the state (is used by ue-form).
    * @param {object} request
    * @returns Promise
    */
    function presaveItem(request) {

        if (request.options.isLoading) {
            return;
        }

        request.options.isLoading = true;

        let deferred = $q.defer(),
            config,
            httpOptions;

        config = getContextAnswer('presave', request);
        removePrimaryKey(config.$dataSource, config.data);
        httpOptions = getAjaxOptionsByTypeService(config, { [config.$dataSource.primaryKey]: config.entityId });

        $rootScope.$broadcast('ue:beforeEntityUpdate', config);

        $http(httpOptions).then(
            onSuccess(config, deferred),
            onReject(config, deferred)
        ).finally(onFinally(config));
        return deferred.promise;
    }

    /**
    * Method for reading of the entity (is used by ue-form).
    * @param {string} id id of the component
    * @param {object} options
    * @returns Promise
    */
    function getItemById(id, options = {}) {

        options.isLoading = true;

        let deferred = $q.defer(),
            request = {
                options: options
            };
        let config = getContextAnswer('one', request);
        let httpOptions = getAjaxOptionsByTypeService(config, { [config.$dataSource.primaryKey]: id });

        if (angular.isObject(config.$dataSource)) {
            $http(httpOptions).then(
                onSuccess(config, deferred),
                onReject(config, deferred)
            ).finally(onFinally(config));
        }
        return deferred.promise;
    }

    /**
    * Method for deleting of the entity (is used by ue-form).
    * @param {object} request
    * @param {boolean} notGoToState If true the state is not changed.
    * @returns Promise
    */
    function deleteItemById(request, notGoToState = false) {

        if (request.options.isLoading) {
            return;
        }
        let deferred = $q.defer(),
            dataSource = request.options.$dataSource,
            config,
            httpOptions;

        request.options.isLoading = true;
        request.notGoToState = notGoToState;

        config = getContextAnswer('delete', request);
        httpOptions = getAjaxOptionsByTypeService(config, { [config.$dataSource.primaryKey]: config.entityId });

        $rootScope.$broadcast('ue:beforeEntityDelete', config);

        $http(httpOptions).then(
            onSuccess(config, deferred),
            onReject(config, deferred)
        ).finally(onFinally(config));
        return deferred.promise;
    }


    /**
     * Converted object with settings which sends from components (like ue-grid, ue-form) to object that os passed to service for working with API.
     * @param {string} action (read, one, create, update, delete)
     * @param {object} request
     * @returns object
     */
    function getContextAnswer(action = 'read', request) {
        let dataSource = request.dataSource || request.options.$dataSource;
        let componentId = request.options.$componentId;
        let filters = {};
        let params = request.params || {};
        let data = request.data || {};
        let pagination;

        // Shape parameter of mix mode of ueGrid
        if (request.options.mixedMode) {
            params.mixed = request.options.mixedMode.collectionType;
        }

        // Shape parameters of pagination
        if (action === 'read' || action === 'one') {
            filters = FilterFieldsStorage.getFilterObject(componentId);
            // Shape parameter of mix mode of ueGrid
            if (request.childId && dataSource.parentKey) {
                filters[dataSource.parentKey] = [{
                    operator: ':value',
                    value: request.childId
                }];
            }
            pagination = {
                perPage: params['per-page'] || 20,
                page: params.page || 1
            };
        }
        return {
            action: action,
            filter: filters,
            params: params,
            data: data,
            sort: params.sort || null,
            parentComponentId: componentId,
            entityId: request.entityId, // ???
            $dataSource: dataSource,
            dataSourceHandlers: dataSource.getHandlers(action),
            buttonHandlers: request.handlers,
            options: request.options,
            state: request.state,
            href: request.href,
            useBackUrl: request.useBackUrl,
            notGoToState: request.notGoToState,
            timeout: request.timeout,
            pagination: pagination
        };
    }

    /**
     * Method sends per 5 requests asyncroniously for data with pagination.
     * @param {object} config
     * @returns promise
     */
    function getUrlResource(config) {
        //Initialize config-object for pull of requests
        config.defer = config.defer || $q.defer();
        config.result = config.result || [];
        config.fromP = config.fromP || 1;
        config.toP = config.toP || 0;
        config.params = config.params || {};
        config.action = 'read';
        config.pagination = config.pagination || {};
        config.pagination.perPage = 50;

        let promiseStack = [];
        let defaultStandard = !config.standard || config.standard === 'YiiSoft';
        let getFirstPage = !config.toP || config.toP === 1;

        if (defaultStandard && config.filter) {
            config.params.filter = FilterFieldsStorage.convertFilterToString(config.filter);
        }

        if (getFirstPage) {
            promiseStack.push(getPromise(config.url));
            config.fromP = 2;
        } else {
            for (var i = config.fromP; i <= config.toP; i++) {
                promiseStack.push(getPromise(config.url, i));
            }
            config.fromP += 5;
        }

        //-- read items from one page
        function getPromise(url, page = 1) {
            let options;
            config.pagination.page = page;
            options = angular.merge({ timeout: config.timeout }, getAjaxOptionsByTypeService(config));
            return $http(options);
        }

        $q.all(promiseStack).then(function(allResp) {
            let resp, countP,
                service = getCustomService(config.standard);
            for (let i = allResp.length; i--;) {
                let list = [];
                resp = allResp[i];
                if (defaultStandard) {
                    list = resp.data.items;
                } else {
                    let serviceResponce = service.processResponse(config, resp);
                    if (serviceResponce && angular.isArray(serviceResponce.items)) {
                        list = serviceResponce.items;
                    }
                }
                config.result = config.result.concat(list);
                if (angular.isFunction(config.callback)) {
                    config.callback(list);
                }
            }
            if (resp && resp.data._meta) {
                countP = resp.data._meta.pageCount;
            }

            if (!countP || countP === config.toP || countP === 1 || !config.serverPagination) {
                config.defer.resolve({ data: { items: config.result } });
            } else {
                config.toP += 5;
                if (config.toP > countP) {
                    config.toP = countP;
                }
                return getUrlResource(config);
            }
        }, onReject(config, config.defer));
        return config.defer.promise;
    }

    /**
     *  Extends data of the components which have valuesRemote settings.
     * options.data has array of records that have the values of components like id. Method collectes all data every component and sends the one request to API
     * @param {object} config
     * @returns promise
    */
    function extendData(options) {
        var data = options.data,
            components = options.components,
            $id = options.$id,
            childrenField = options.childrenField,
            selfField = options.selfField;
        var configs = [];
        var remoteComponents = components.filter(function(component) {
            return angular.isObject(component.component.settings.valuesRemote);
        });
        var defaultStandard = !options.standard || options.standard === 'YiiSoft';
        var standard = options.standard;
        var promiseStack = [];

        /** Generate promise stacks */
        remoteComponents.forEach(function(component) {
            var fields = [];
            var filter = [];
            var options = component.component.settings.valuesRemote;

            if (angular.isObject(options.fields)) {
                angular.forEach(options.fields, function(value, key) {
                    if (angular.isString(value)) {
                        fields.push(value);
                    }
                });
            }
            fields = fields.join(',');
            if (angular.isString(options.url)) {
                var keyValue = component.component.settings.valuesRemote.fields.value;
                filter = takeRemoteValuesInTree(data, component, childrenField, selfField);

                if (filter.length > 0) {
                    var casheValues = getFromStorage(component, filter);
                    if (casheValues !== false) {
                        return promiseStack.push($q.when(data));
                    }

                    var filterObject = {};
                    filterObject[keyValue] = [];
                    filterObject[keyValue].push({
                        operator: ':value',
                        value: filter
                    });
                    // console.dir(filterObject);
                    var config = {
                        action: 'read',
                        url: options.url,
                        method: 'GET',
                        params: {
                            fields: fields,
                            filter: FilterFieldsStorage.convertFilterToString(filterObject),
                            page: 1,
                            'per-page': 50
                        },
                        pagination: {
                            page: 1,
                            perPage: 50
                        },
                        standard: standard
                    };

                    //  console.dir(config);
                    configs.push(config);
                    promiseStack.push($http(getAjaxOptionsByTypeService(config)));
                }
            }
        });
        var service = getCustomService(options.standard);
        return $q.all(promiseStack).then(function(allResp) {
            allResp.forEach(function(response, index) {
                if (response.data) {
                    var list = service.processResponse(configs[index], response).items || [];
                    var component = remoteComponents.filter(function(component) {
                        return component.component.settings.valuesRemote.url === response.config.url;
                    })[0];
                    saveToStorage(component, list);
                }
            });
            return allResp;
        }, function(reject) {
            reject.$componentId = $id;
            var config = {
                action: 'read',
                parentComponentId: $id
            };
            if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                var data = service.processResponse(config, reject,
                    successAnswer.bind(config),
                    failAnswer.bind(config));
                reject.data = data;
            } else {
                failAnswer.bind(config)(reject);
            }
        });
    }


    /**
     * Returns the service for working with API. (Default YiiSoftApiService)
     * @param {string} standard Standard that forms the name of service like "{standard}ApiService"
     * @returns Angular service
     */
    function getCustomService(standard = 'YiiSoft') {
        let serviceApi;
        if ($injector.has(standard + 'ApiService')) {
            serviceApi = $injector.get(standard + 'ApiService')
        }
        if (angular.isUndefined(standard)) {
            MessagesService.consoleError('ERROR.FIELD.EMPTY', { '%field': 'standard' });
        } else if (angular.isUndefined(serviceApi)) {
            MessagesService.consoleError('ERROR.UNDEFINED_API_SERVICE');
        }
        return serviceApi;
    }

    /**
     * Gets options for request by the configuration object. To obtain the settings for the query method uses the dataSource and processes the data using the service for working with (default YiiSoftApiService).
     * @param {object} config Configuration object from getContextAnswer-method.
     * @param {object} entity The entity that is sent to DataSource methods. The datasource-object is in config.$datasource.
     * @returns {objects}
     */
    function getAjaxOptionsByTypeService(config, entity) {
        let standard = 'YiiSoft',
            action = config.action;
        if (config.standard) {
            standard = config.standard;
        } else if (config.$dataSource && config.$dataSource.standard) {
            standard = config.$dataSource.standard;
        }

        if (config.action === 'presave') {
            action = config.entityId ? 'update' : 'create';
        }

        var serviceApi = getCustomService(standard);

        var options = {};
        if (config.$dataSource && config.$dataSource instanceof DataSource) {
            options = {
                headers: config.$dataSource.getHeaders(action, entity),
                method: config.$dataSource.getMethod(action),
                data: config.$dataSource.getData(action, entity),
                params: config.$dataSource.getParams(action, entity),
                url: config.$dataSource.getURL(action, entity),
                beforeSend: config.$dataSource.getHandlers(action).before
            };
        } else {
            options = {
                headers: config.headers || {},
                method: config.method,
                data: config.data || {},
                params: config.params || {},
                url: config.url
            };
        }

        if (config.buttonHandlers && config.buttonHandlers.before) {
            options.beforeSendButton = config.buttonHandlers.before;
        }

        if (angular.isDefined(serviceApi)) {
            if (angular.isFunction(serviceApi.getHeaders)) {
                angular.merge(options.headers, serviceApi.getHeaders(config));
            }
            if (angular.isFunction(serviceApi.getMethod)) {
                options.method = options.method || serviceApi.getMethod(config);
            }
            if (angular.isFunction(serviceApi.getData)) {
                angular.merge(options.data, serviceApi.getData(config));
            }
            if (angular.isFunction(serviceApi.getParams)) {
                angular.merge(options.params, serviceApi.getParams(config));
            }
            if (angular.isFunction(serviceApi.getURL)) {
                options.url = serviceApi.getURL(config) || options.url;
            }
        }
        if ($.isEmptyObject(options.headers)) {
            delete options.headers;
        }

        return options;
    }

    /**
     * Method sends the request.
     * @param {object} request Configuration object with url, params, method and before-error-success-complete calbacks.
     * @returns Promise
     */
    function actionRequest(request) {
        let deferred = $q.defer();
        if (request.id) {
            url = request.url.replace(':id', id);
        }
        self.isProcessing = true;

        $http({
            method: request.method,
            url: request.url,
            params: request.params || {},
            beforeSend: request.before
        }).then(function(response) {
            if (angular.isFunction(request.success)) {
                request.success(response);
            }
            deferred.resolve(response);
        }, function(reject) {
            if (angular.isFunction(request.error)) {
                request.error(reject);
            }
            deferred.reject(reject);
        }).finally(function() {
            if (angular.isFunction(request.complete)) {
                request.complete();
            }
            self.isProcessing = false;
        });

        return deferred.promise;
    }

    /**
     * The method uses components with remote data, which specify the configuration `depend` (like ue-autocomplete, ue-dropdown and etc.)
     * @param {string} url Url with substring  like {:dependField::dependValue}
     * @param {object} queryParams Object with query parameters which will be merged to url.
     * @param {string} dependField
     * @param {string|Array} dependValue
     * @returns string with URL
     */
    function getUrlDepend(url, queryParams, dependField, dependValue) {
        if (angular.isString(dependValue)) {
            dependValue = '"' + dependValue + '"';
        }
        if (angular.isArray(dependValue)) {
            dependValue = dependValue.filter(function(item) {
                return item !== null && item !== undefined;
            });
            dependValue = '"' + dependValue.join(',') + '"';
        }
        url = url.replace(':dependField', dependField).replace(':dependValue', dependValue);
        return this.getUrlWithParams(url, queryParams);
    }

    /**
     * The method parses url and adds the query parameters to the one.
     * @param {string} url Url with substring  like {:dependField::dependValue}
     * @param {object} queryParams Object with query parameters which will be merged to url.
     * @returns string with URL
     */
    function getUrlWithParams(url, queryParams) {
        url = decodeURI(url);
        var urlArray = url.split('?'),
            search = [],
            searchObject = {},
            split;

        if (!!urlArray[1]) {
            search = urlArray[1].split('&');
        }

        for (var i = 0; i < search.length; i++) {
            split = search[i].split('=');
            try {
                searchObject[split[0]] = eval('(' + split[1] + ')');
            } catch (e) {
                searchObject[split[0]] = split[1];
            }
        }
        if (queryParams) {
            searchObject = angular.merge(searchObject, queryParams);
        }
        var params = decodeURIComponent($httpParamSerializer(searchObject));
        return urlArray[0] + (params ? ('?' + params) : '');
    }

    /**
     *
     * @param {string} url
     * @param {object} keys (Optionally parameter) keys which you want to replaced in url. For example {':pk': 2}
     */
    function replaceToURL(url, keys = {}) {
        let params = $location.search(),
            searchParams;
        url = MessagesService.mapReplacingKeys(url, keys);
        if (params.back) {
            delete params.back;
        }
        searchParams = $httpParamSerializerJQLike(params);
        if (url.indexOf('?') === -1) {
            searchParams = '?' + searchParams;
        } else {
          searchParams = '&' + searchParams;
        }
        $window.location.href = url + searchParams;
    }

    /**
     * Calls callback-methods from the settings object.
     * @param {object} config Object with settings.
     * @param {object} data Tha data that is sent as argument to the callback
     * @param {string} callbackName The name of callback (default success)
     * @returns string with URL
     */
    function initHandler(config, data, callbackName = 'success') {
        if (config.dataSourceHandlers && angular.isFunction(config.dataSourceHandlers[callbackName])) {
            config.dataSourceHandlers[callbackName].call(null, data);
        }
        if (config.buttonHandlers && angular.isFunction(config.buttonHandlers[callbackName])) {
            config.buttonHandlers[callbackName].call(null, data);
        }
    }


    /**
     * Changes the state with option.
     * @param {object} config Object with settings.
     * @param {object} data Tha data that is sent as argument to the callback
     * @param {string} callbackName The name of callback (default success)
     * @returns string with URL
     */
    function goToState(config, callback, options) {
        let params = {},
            queryParams = $location.search(),
            parentQueryParamName = config.options.prefixGrid ? config.options.prefixGrid + '-parent' : 'parent',
            parentQueryParamValue = queryParams[parentQueryParamName],
            state;

        if (config.entityId) {
            params.entityId = config.entityId;
        }
        if (parentQueryParamValue) {
            params.parent = parentQueryParamValue;
        }
        if (queryParams.back && config.useBackUrl) {
            state = queryParams.back;
        } else {
            state = config.state;
        }
        if (!config.notGoToState) {
            if (state) {
                if(angular.isObject(state)) {
                    if(angular.isFunction(state.parameters)) {
                        let stateParameters = state.parameters.bind(config)();
                        if(angular.isObject(stateParameters)) {
                            angular.merge(params, stateParameters);
                        }
                    }
                    state = state.name;
                }
                $state.go(state, params, options).then(function() {
                    $location.search(queryParams);
                    if (angular.isFunction(callback)) {
                        callback(config);
                    }
                });
            } else {
                replaceToURL(config.href);
                if (angular.isFunction(callback)) {
                    callback(config);
                }
            }
        } else {
            if (angular.isFunction(callback)) {
                callback(config);
            }
        }
    }

    /**
     * The method is used as success callback after CRUD operaions (getItemsList, addNewItem, updateItem, presaveItem, getItemById, deleteItemById).
     * As the context of uses the object which getContextAnswer-method returns.
     */
    function successAnswer(data = {}) {
        let config = this,
            params = {},
            queryParams = $location.search(),
            parentComponentId = config.parentComponentId,
            isCreate = !config.entityId;
        if (angular.isObject(data)) {
            data.$dataSource = config.$dataSource;
        }
        switch (config.action) {
            case 'read':
                initHandler(config, data);
                data.$componentId = parentComponentId;
                $rootScope.$broadcast('ue:componentDataLoaded', data);
                break;
            case 'one':
                initHandler(config, data);
                data.editorEntityType = 'exist';
                data.$componentId = parentComponentId;
                $rootScope.$broadcast('ue:componentDataLoaded', data);
                break;
            case 'update':
                var state;
                initHandler(config, data);
                $rootScope.$broadcast('ue:afterEntityUpdate', { id: config.id, $componentId: parentComponentId });
                goToState(config, () => MessagesService.success('CHANGE_RECORDS.UPDATE'));
                break;
            case 'create':
                initHandler(config, data);
                $rootScope.$broadcast('ue:afterEntityCreate', {
                    id: data[config.$dataSource.primaryKey],
                    $componentId: parentComponentId
                });
                goToState(config, () => MessagesService.success('CHANGE_RECORDS.CREATE'));
                break;
            case 'presave':
                initHandler(config, data);
                if (!config.state) {
                    config.state = $state.current.name;
                }
                config.entityId = config.entityId || data[config.$dataSource.primaryKey];
                goToState(
                    config,
                    (config) => {
                        $rootScope.$broadcast('ue:afterEntityUpdate', {
                            $componentId: parentComponentId,
                            action: 'presave',
                            value: data,
                            id: config.entityId
                        });
                        if (isCreate) {
                            MessagesService.success('CHANGE_RECORDS.CREATE');
                        } else {
                            MessagesService.success('CHANGE_RECORDS.UPDATE');
                        }
                    },
                    { reload: false, notify: false });
                break;
            case 'delete':

                initHandler(config, data);

                if (!config.state) {
                    config.state = $state.current.name;
                }
                goToState(config, (config) => {
                    $rootScope.$broadcast('ue:afterEntityDelete', {
                        $componentId: config.parentComponentId,
                        entityId: config.entityId
                    });
                    $rootScope.$broadcast('ue:collectionRefresh', parentComponentId);
                    MessagesService.success('CHANGE_RECORDS.DELETE');
                });
                break;
        }
        if (config.options) {
          config.options.isLoading = false;
        }
    }

    /**
     * The method is used as reject callback after CRUD operaions (getItemsList, addNewItem, updateItem, presaveItem, getItemById, deleteItemById).
     * As the context of uses the object which getContextAnswer-method returns.
     */
    function failAnswer(reject) {
        let config = this,
            parentComponentId = config.parentComponentId || config.$id;
        reject.$componentId = config.$componentId;
        if (config.action == 'update' || config.action == 'create' || config.action == 'presave') {
            MessagesService.httpStatusMsg(reject.status);
            initHandler(config, reject, 'error');
            var wrongFields = [];
            if (angular.isArray(reject)) {
                wrongFields = reject;
            } else if (angular.isObject(reject)) {
                if (angular.isArray(reject.data)) {
                    wrongFields = reject.data;
                } else if (angular.isObject(reject.data) && angular.isArray(reject.data.data)) {
                    wrongFields = reject.data.data;
                }
            }
            if (wrongFields.length > 0) {
                $rootScope.$broadcast('ue:componentError', { $componentId: parentComponentId, data: wrongFields });
            }
        } else if (config.action == 'delete') {
            MessagesService.httpStatusMsg(reject.status);
            initHandler(config, reject, 'error');
            config.request.options.isLoading = false;
        } else if (config.action == 'read' || config.action == 'one') {
            initHandler(config, reject, 'error');
            reject.$componentId = parentComponentId;
            $rootScope.$broadcast('ue:errorComponentDataLoading', reject);
        }
    }

    /**
     * The methods uses for getting linear list of data from object with format
     * [
     *  {
     *    <selfField>: { <component_name>: value1 }
     *    <childrenField>: [
     *       {
     *        <selfField>: { <component_name>: value2 }
     *        <childrenField>: [...]
     *       },
     *       {
     *        <selfField>: { <component_name>: value3 }
     *        <childrenField>: [...]
     *       }
     *      ....
     *    ]
     *  }
     * ]
     * @param {array} data Input object with hierachy.
     * @param {object} component Configuration of the component.
     * @param {string} childrenField Name of field which stores the children object.
     * @param {string} selfField Name of field which stores the object with output data.
     * @param {array} filter the reference to the output linear list.
     * @returns Array
     */
    function takeRemoteValuesInTree(data = [], component, childrenField, selfField, filter = []) {
        let keyValue = component.component.settings.valuesRemote.fields.value;
        data.forEach(function(item) {
            var value = selfField ? item[selfField][component.name] : item[component.name];
            if (angular.isArray(value)) {
                value.forEach(function(valueItem) {
                    if (angular.isString(component.component.settings.multiname)) {
                        valueItem = valueItem[component.component.settings.multiname];
                    } else {
                        if (angular.isObject(valueItem) && keyValue) {
                            valueItem = valueItem[keyValue];
                        }
                    }
                    if (valueItem !== undefined && valueItem !== null && filter.indexOf(valueItem) === -1) {
                        filter.push(valueItem);
                    }
                });
            } else {
                if (value !== undefined && value !== null && filter.indexOf(value) === -1) {
                    filter.push(value);
                }
            }
            if (angular.isArray(item[childrenField]) && item[childrenField].length > 0) {
                takeRemoteValuesInTree(item[childrenField], component, childrenField, selfField, filter);
            }
        });
        return filter;
    }

    function saveToStorage(component, list, options) {
        let remoteSettings = component.component.settings.valuesRemote,
            url = remoteSettings.url,
            storage = storageRemotedComponents[url] || [];
        if (angular.isObject(options) && options.dependValue) {
            var key = url + '[' + options.dependValue + ']';
            if (self.alreadyRequested.indexOf(key) === -1) {
                self.alreadyRequested.push(key);
            }
        }
        if (angular.isArray(list)) {
            angular.forEach(list, checkExisting);
        } else if (angular.isObject(list)) {
            checkExisting(list);
        }
        storageRemotedComponents[url] = storage;
        function checkExisting(listItem) {
            let keyValue = remoteSettings.fields.value,
                id = listItem[keyValue];
            if (id !== undefined && id !== null) {
                let isExist = storage.some((storageItem) => storageItem[keyValue] === listItem[keyValue]);
                if (!isExist) {
                    storage.push(listItem);
                }
            }
        }
    }

    function getFromStorage(component, list, options) {
        var url = component.component.settings.valuesRemote.url;
        if (angular.isObject(options) && options.dependValue) {
            var key = url + '[' + options.dependValue + ']';
            if (self.alreadyRequested.indexOf(key) === -1) {
                return false;
            }
        }
        var dependField = component.component.settings.depend;
        var keyValue = component.component.settings.valuesRemote.fields.value;
        if (!storageRemotedComponents.hasOwnProperty(url)) {
            return false;
        }
        var storage = storageRemotedComponents[url] || [];
        var outputSet = [];
        if (list) {
            if (!angular.isArray(list)) {
                list = [list];
            }
            if (component.component.settings.multiname) {
                var multiname = component.component.settings.multiname;
                list = list.map(function(item) { return angular.isObject(item) ? item[multiname] : null; });
            }
            angular.forEach(storage, function(storageItem) {
                var index = list.indexOf(storageItem[keyValue]);
                if (index !== -1) {
                    outputSet.push(storageItem);
                }
            });
        } else {
            if (angular.isObject(options) && options.dependValue) {
                angular.forEach(storage, function(storageItem) {
                    if (storageItem[dependField] == options.dependValue) {
                        outputSet.push(storageItem);
                    }
                });
            } else {
                outputSet = storage;
            }
        }
        if (!list) {
            return outputSet;
        } else if (outputSet.length === list.length && list.length > 0) {
            outputSet = list.map(id => outputSet.filter(a => a[keyValue] === id)[0]);
            return outputSet;
        } else {
            return false;
        }
    }
}

export { ApiService };
