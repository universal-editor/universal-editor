(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('EditEntityStorage', EditEntityStorage);

    function EditEntityStorage($rootScope, $timeout, configData, $location, $state, $translate, ApiService) {
        'ngInject';
        var fieldControllers = [],
            self = this,
            storage = {},
            groups = {};

        this.getLevelChild = function(stateName) {
            return stateName.split('.').length;
        };

        this.getValueField = function(componentId, fieldName) {
            var controllers = storage[componentId] || [];
            for (var i = controllers.length; i--;) {
                var controller = controllers[i];
                if (controller.fieldName === fieldName) {
                    return controller.getFieldValue();
                }
            }
            return false;
        };

        this.getChildFieldComponents = function(componentId) {
            return storage[componentId] || [];
        };

        this.getChildGroupComponents = function(componentId) {
            return groups[componentId] || [];
        };

        this.newSourceEntity = function(id, parentField) {
            var parentEntity = $location.search().parent;
            var parent;
            if (parentEntity) {
                parentEntity = JSON.parse(parentEntity);
                parent = parentEntity[id] || null;
            }
            var data = { editorEntityType: 'new', $componentId: (!!parentField ? undefined : id) };
            if (!!parent && !!parentField) {
                data[parentField] = parent;
            }
            $rootScope.$broadcast('ue:componentDataLoaded', data);
        };

        this.addFieldController = function(ctrl, isGroup) {
            var id = ctrl.parentComponentId;
            if (id) {
                if (isGroup === true) {
                    groups[id] = groups[id] || [];
                    groups[id].push(ctrl);
                } else {
                    storage[id] = storage[id] || [];
                    storage[id].push(ctrl);
                }
                ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
            }
        };

        this.deleteFieldController = function(ctrl) {
            var controllers = storage[ctrl.parentComponentId];
            if (controllers) {
                angular.forEach(controllers, function(controller, ind) {
                    if (controller.$fieldHash === ctrl.$fieldHash) {
                        controllers.splice(ind, 1);
                    }
                });
            }
        };

        this.editEntityUpdate = function(type, request) {
            var entityObject = constructOutputValue(request);
            if (request.isError) {
                request.data = entityObject;
                switch (type) {
                    case 'create':
                        ApiService.addNewItem(request);
                        break;
                    case 'update':
                        ApiService.updateItem(request);
                        break;
                }
            }
        };

        this.editEntityPresave = function(request) {
            var entityObject = constructOutputValue(request);

            if (request.isError) {
                request.data = entityObject;
                request.action = 'presave';
                ApiService.presaveItem(request);
            }
        };

        function constructOutputValue(request, extended) {
            var entityObject = {},
                componentId = angular.isString(request) ? request : request.options.$componentId,
                controllers = storage[componentId] || [],
                groupControllers = groups[componentId] || [];
            if (request) {
                if (angular.isObject(request)) {
                    request.isError = true;
                }
                angular.forEach(controllers, function(fCtrl) {
                    if (angular.isObject(request)) {
                        request.isError = (fCtrl.error.length === 0) && request.isError;
                    }
                    if (fCtrl.disabled !== true && fCtrl.useable !== false) {
                        var value = {};
                        value = fCtrl.getFieldValue(extended);
                        if (fCtrl.fieldName && typeof (value[fCtrl.fieldName]) !== 'undefined' && value[fCtrl.fieldName] !== null) {
                            value = value[fCtrl.fieldName];
                        } else {
                            value = null;
                        }

                        if (!fCtrl.multiple) {
                            fCtrl.inputLeave(fCtrl.fieldValue);
                        } else {
                            var flagError = true;
                            angular.forEach(fCtrl.fieldValue, function(val, index) {
                                if (flagError) {
                                    fCtrl.inputLeave(val, index);
                                    if (fCtrl.error.length !== 0) {
                                        flagError = false;
                                    }
                                }
                            });
                        }

                        if (angular.isString(fCtrl.fieldName)) {
                            var names = fCtrl.fieldName.split('.');
                            var tempObject = entityObject;
                            var isArray = false;
                            var partName = '';
                            angular.forEach(names, function(name, i) {
                                var empty = {};
                                partName = partName ? (partName + '.' + name) : name;
                                if (name.lastIndexOf('[]') === (name.length - 2)) {
                                    name = name.substr(0, name.length - 2);
                                    empty = [];
                                }
                                let component = fCtrl.getParentComponent(partName);
                                if (angular.isArray(tempObject)) {
                                    if (component) {
                                        var parentIndex = component.parentFieldIndex || 0;
                                        tempObject[parentIndex] = tempObject[parentIndex] || {};
                                        tempObject = tempObject[parentIndex];
                                    }
                                }
                                if (i !== (names.length - 1)) {
                                    tempObject[name] = tempObject[name] || empty;
                                    tempObject = tempObject[name];
                                } else {
                                    tempObject[name] = value;
                                }
                                if (component && component.resourceType && angular.isObject(tempObject) && !angular.isArray(tempObject)) {
                                    tempObject.__type = component.resourceType;
                                }
                            });
                        }
                    }
                });

                angular.forEach(groupControllers, function(fGroup) {
                    if (angular.isString(fGroup.setting.name) && fGroup.multiple === true) {
                        var names = fGroup.setting.name.split('.');
                        var tempObject = entityObject;
                        var partName = '';
                        angular.forEach(names, function(name, i) {
                            partName = partName ? (partName + '.' + name) : name;
                            if (name.lastIndexOf('[]') === (name.length - 2)) {
                                name = name.substr(0, name.length - 2);
                            }
                            if (angular.isObject(tempObject[name])) {
                                tempObject = tempObject[name];
                            } else {
                                tempObject[name] = [];
                            }
                        });
                    }
                });
            }
            return entityObject;
        }

        this.updateComponents = function updateComponents(componentId) {
            var output = constructOutputValue(componentId, true);
            output.$componentId = componentId;
            $rootScope.$broadcast('ue:componentValueChanged', output);
        }
    }
})();
