(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('EditEntityStorage', EditEntityStorage);

    EditEntityStorage.$inject = ['$rootScope', '$timeout', 'configData', '$location', '$state', '$translate'];

    function EditEntityStorage($rootScope, $timeout, configData, $location, $state, $translate) {
        var sourceEntity,
            configuredFields = {},
            fieldControllers = [],
            entityObject,
            self = this,
            storage = {};

        /* PUBLIC METHODS */

        this.actionType = 'create';

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
            $rootScope.$broadcast('editor:entity_loaded', data);
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
            this.setActionType(request.collectionType);
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
            if (isError) {
                request.data = entityObject;
                switch (type) {
                    case 'create':
                        $rootScope.$emit('editor:create_entity', request);
                        break;
                    case 'update':
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

            if (isError) {
                request.data = entityObject;
                $rootScope.$emit('editor:presave_entity', request);
            }
        };

        this.getEntity = function(stateName) {
            return configData;
        };

        this.getStateConfig = function(stateName) {

            var result = null;
            var entity = configData;

            angular.forEach(configData.states, function(state) {
                if (state.name) {
                    if (state.name === stateName) {
                        result = state;
                    }
                }
            });
            if (!stateName) {
                return configData.states[0];
            }
            return result;
        };

        /* !PUBLIC METHODS */

        /* EVENTS LISTENING */

        $rootScope.$on('editor:add_entity', function(event, data) {
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
                $translate('ERROR.EditEntityStorage').then(function(translation) {
                    console.log(translation);
                });
                valid = false;
            }

            return valid;
        }

        /* !PRIVATE METHODS */
    }
})();
