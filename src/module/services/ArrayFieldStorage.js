(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('ArrayFieldStorage',ArrayFieldStorage);

    ArrayFieldStorage.$inject = ['$rootScope'];

    function ArrayFieldStorage($rootScope){
        var ArrayFields = {};
        this.setArrayField = function (fieldName,fieldValue) {
            ArrayFields[fieldName] = fieldValue;
        };

        this.getFieldValue = function (parentField,fieldIndex,fieldName) {
            if( ArrayFields.hasOwnProperty(parentField) &&
                ArrayFields[parentField][fieldIndex] !== undefined &&
                ArrayFields[parentField][fieldIndex].hasOwnProperty(fieldName)){
                    return ArrayFields[parentField][fieldIndex][fieldName];
            } else {
                return false;
            }
        };

        this.removeFieldIndex = function (fieldName,fieldIndex) {
            ArrayFields[fieldName].splice(fieldIndex,1);
        };

        this.fieldDestroy = function (parentField,fieldIndex,fieldName,value) {
            if (ArrayFields[parentField][fieldIndex] === undefined) {
                ArrayFields[parentField][fieldIndex] = {};
                ArrayFields[parentField][fieldIndex][fieldName] = value;

            } else {
                ArrayFields[parentField][fieldIndex][fieldName] = value;
            }
        };

        $rootScope.$on('editor:set_entity_type',function (event,type) {
            ArrayFields = [];
        });
    }
})();
