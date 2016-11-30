(function() {
    'use strict';

    angular
        .module('universal.editor')
        .service('EditEntityStorage', EditEntityStorage);

    EditEntityStorage.$inject = ['$rootScope', '$timeout', 'configData', '$location', '$state'];

    function EditEntityStorage($rootScope, $timeout, configData, $location, $state) {
        var sourceEntity,
            configuredFields = {},
            fieldControllers = [],
            entityType,
            entityObject,
            self = this,
            storage = {};

        /* PUBLIC METHODS */

        this.actionType = "create";

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
            var data = { editorEntityType: "new", $parentComponentId: (!!parentField ? undefined : id) };
            if (!!parent && !!parentField) {
                data[parentField] = parent;
            }
            $rootScope.$broadcast("editor:entity_loaded", data);
        };

        this.setSourceEntity = function(data) {
            data.editorEntityType = "exist";
            //$rootScope.$broadcast("editor:component_init", data);
            $rootScope.$broadcast("editor:entity_loaded", data);
        };

        this.getEntityType = function() {
            return entityType;
        };

        this.setEntityType = function(type) {
            entityType = type;
        };

        this.addFieldController = function(ctrl) {
            var id = ctrl.parentComponentId;
            if (id) {
                storage[id] = storage[id] || [];
                storage[id].push(ctrl);
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

        this.setActionType = function(type) {
            this.actionType = type;
        };


        this.editEntityUpdate = function(type, request) {
            this.setActionType(request.entityType);
            var entityObject = {};
            var controllers = storage[request.options.$parentComponentId] || [];
            var isError = true;

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

                isError = (fCtrl.error.length === 0) && isError;
                if (!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false) {
                    if (fCtrl.parentField && fCtrl.parentFieldIndex !== false) {
                        entityObject[fCtrl.parentField] = entityObject[fCtrl.parentField] || [];
                        entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] = entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] || {};
                        angular.merge(entityObject[fCtrl.parentField][fCtrl.parentFieldIndex], value[fCtrl.parentField]);
                    } else {
                        angular.merge(entityObject, value);
                    }
                }
            });
            if (isError) {
                request.data = entityObject;
                switch (type) {
                    case "create":
                        $rootScope.$emit('editor:create_entity', request);
                        break;
                    case "update":
                        $rootScope.$emit('editor:update_entity', request);
                        break;
                }
            }
        };

        this.editEntityPresave = function(request) {
            var entityObject = {};
            var isError = true;
            var controllers = storage[request.options.$parentComponentId] || [];

            angular.forEach(controllers, function(fCtrl) {
                var value = fCtrl.getFieldValue();
                if (!fCtrl.multiple) {
                    fCtrl.inputLeave(fCtrl.fieldValue);
                } else {
                    var flagError = true;
                    angular.forEach(fCtrl.fieldValue, function(val, index){
                        if (flagError) {
                            fCtrl.inputLeave(val, index);
                            if (fCtrl.error.length !== 0) {
                                flagError = false;
                            }
                        }
                    });
                }
                isError = (fCtrl.error.length === 0) && isError;
                if (!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false) {
                    if (fCtrl.parentField && fCtrl.parentFieldIndex !== false) {
                        entityObject[fCtrl.parentField] = entityObject[fCtrl.parentField] || [];
                        entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] = entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] || {};
                        angular.merge(entityObject[fCtrl.parentField][fCtrl.parentFieldIndex], value[fCtrl.parentField]);
                    } else {
                        angular.merge(entityObject, value);
                    }
                }
                if (!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false) {
                    angular.merge(entityObject, fCtrl.getFieldValue());
                }
            });

            if (isError) {
                request.data = entityObject;
                $rootScope.$emit('editor:presave_entity', request);
            }
        };

        this.getEntity = function(stateName, entityName) {
            return configData.entities.filter(function(item) {
                return item.name === entityType;
            })[0];
        };

        this.getStateConfig = function(stateName, entityName) {

            entityName = entityName || entityType;
            var result = null;

            if (stateName.indexOf(entityName + '_') !== 0) {
                stateName = entityName + '_' + stateName;
            }

            angular.forEach(configData.entities, function(entity) {
                if (entity.name === entityName) {
                    angular.forEach(entity.states, function(state) {
                        if (state.name) {
                            if (state.name.indexOf(entityName + '_') !== 0) {
                                state.name = entityName + '_' + state.name;
                            }
                            if (state.name === stateName) {
                                result = state;
                            }
                        }
                    });
                }
            });
            return result;
        };

        /* !PUBLIC METHODS */

        /* EVENTS LISTENING */

        $rootScope.$on("editor:add_entity", function(event, data) {
            self.actionType = data;
        });

        $rootScope.$on('editor:set_entity_type', function(event, type) {
            entityObject = type;
            fieldControllers = [];
        });

        /* !EVENTS LISTENING */

        /* PRIVATE METHODS */

        function validateEntityFields() {

            var valid = true;

            if (sourceEntity === undefined || entityType === undefined) {
                console.log("EditEntityStorage: Сущность не доступна для проверки так как она не указана или не указан её тип");
                valid = false;
            }

            return valid;
        }

        /* !PRIVATE METHODS */
    }
})();
