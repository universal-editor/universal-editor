(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('EditEntityStorage',EditEntityStorage);

    EditEntityStorage.$inject = ['$rootScope','$timeout','configData','$location', '$state'];

    function EditEntityStorage($rootScope,$timeout,configData,$location, $state){
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

        this.getValueField = function(fieldName) {
            for (var i = fieldControllers.length; i--;) {
                var controller = fieldControllers[i];
                if (controller.fieldName === fieldName) {
                    return controller.getFieldValue();
                }
            }
        };

        this.newSourceEntity = function (id) {
            id = id || '';
            $rootScope.$broadcast("editor:entity_loaded" + id, { editorEntityType: "new"});
        };

        this.setSourceEntity = function (data) {
            data.editorEntityType = "exist";
            $rootScope.$broadcast("editor:entity_loaded", data);
        };

        this.getEntityType = function () {
            return entityType;
        };

        this.setEntityType = function (type) {
            entityType = type;
        };

        this.addFieldController = function (ctrl, id) {
            fieldControllers.push(ctrl);
            storage[id] = storage[id] || [];
            storage[id].push(ctrl);
            ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
        };

        this.deleteFieldController = function (ctrl) {
            angular.forEach(fieldControllers, function (fc, ind) {
                if (fc.$fieldHash === ctrl.$fieldHash){
                    fieldControllers.splice(ind,1);
                }
            });
        };

        this.setActionType = function (type) {
            this.actionType = type;
        };


        this.editEntityUpdate = function (type, request) {
            this.setActionType(request.entityType);
            var entityObject = {};
            angular.forEach(fieldControllers,function(fCtrl){
                if(!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false){
                    angular.merge(entityObject,fCtrl.getFieldValue());
                }
            });
            request.data = entityObject;
            switch (type) {
                case "create":
                    $rootScope.$emit('editor:create_entity', request);
                    break;
                case "update":
                    $rootScope.$emit('editor:update_entity', request);
                    break;
            }
        };

        this.editEntityPresave = function (request) {
            var entityObject = {};
            angular.forEach(fieldControllers,function(fCtrl){
                if(!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false){
                    angular.merge(entityObject,fCtrl.getFieldValue());
                }
            });
            request.data = entityObject;

            $rootScope.$emit('editor:presave_entity', request);
        };

        this.getEntity = function(stateName, entityName) {
            return configData.entities.filter(function (item) {
                return item.name === entityType;
            })[0];
        };

        this.getStateConfig = function(stateName, entityName) {
            var entityName = entityName || entityType;
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

        $rootScope.$on("editor:add_entity", function (event,data) {
            self.actionType = data;
        });

        $rootScope.$on('editor:set_entity_type',function (event,type) {
            entityObject = type;
            fieldControllers = [];
        });

        /* !EVENTS LISTENING */

        /* PRIVATE METHODS */

        function validateEntityFields(){

            var valid = true;

            if (sourceEntity === undefined || entityType === undefined){
                console.log("EditEntityStorage: Сущность не доступна для проверки так как она не указана или не указан её тип");
                valid = false;
            }

            return valid;
        }

        /* !PRIVATE METHODS */
    }
})();
