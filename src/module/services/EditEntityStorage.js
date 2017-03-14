(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('EditEntityStorage', EditEntityStorage);

    function EditEntityStorage($rootScope, $timeout, configData, $location, $state, $translate, YiiSoftApiService) {
        "ngInject";
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

        this.newSourceEntity = function(id, parentField) {
            var parentEntity = $location.search().parent;
            var parent;
            if (parentEntity) {
                parentEntity = JSON.parse(parentEntity);
                parent = parentEntity[id] || null;
            }
            var data = { editorEntityType: 'new', $parentComponentId: (!!parentField ? undefined : id) };
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
                        YiiSoftApiService.addNewItem(request);
                        break;
                    case 'update':
                        YiiSoftApiService.updateItem(request);
                        break;
                }
            }
        };

        this.editEntityPresave = function(request) {
            var entityObject = constructOutputValue(request);

            if (request.isError) {
                request.data = entityObject;
                request.$action = 'presave';
                YiiSoftApiService.presaveItem(request);
            }
        };

        function constructOutputValue(request) {
            var entityObject = {};
            var controllers = storage[request.options.$parentComponentId] || [],
                groupControllers = groups[request.options.$parentComponentId] || [];
            request.isError = true;

            angular.forEach(controllers, function(fCtrl) {
                var value = fCtrl.getFieldValue();
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

                request.isError = (fCtrl.error.length === 0) && request.isError;
                if (fCtrl.readonly !== true && fCtrl.disabled !== true) {
                    if (fCtrl.parentField && fCtrl.parentFieldIndex !== false) {
                        entityObject[fCtrl.parentField] = entityObject[fCtrl.parentField] || [];
                        entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] = entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] || {};
                        angular.merge(entityObject[fCtrl.parentField][fCtrl.parentFieldIndex], value[fCtrl.parentField]);
                    } else {
                        angular.merge(entityObject, value);
                    }
                }

            });
            angular.forEach(groupControllers, function(val, index) {
                if (val.fieldName && entityObject[val.fieldName] === undefined) {
                    entityObject[val.fieldName] = val.multiple ? [] : null;
                }
            });
            return entityObject;
        }
    }
})();
