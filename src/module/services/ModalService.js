(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('ModalService', ModalService);

    ModalService.$inject = ['$q','$rootScope','$http','configData','EditEntityStorage','$location','$timeout','$state','$httpParamSerializer', '$document', '$uibModal'];

    function ModalService($q,$rootScope,$http,configData,EditEntityStorage,$location,$timeout,$state,$httpParamSerializer, $document, $uibModal){
     var 
     self = this,
     modalInstance,
     isOpen = false;

     self.open = function(component) { /** send fromState и _pk */
         var settings = component.settings;

         modalInstance = $uibModal.open({
             component: 'ueModal',
             resolve: {
                 settings: function() {
                     return settings;
                 }
             }
         });

         modalInstance.rendered.then(function() {
             isOpen = true;
         });

         modalInstance.result.then(function() {
         }, function() {
             isOpen = false;
             modalInstance = null;
             if (settings.fromState) {
                 $state.go(settings.fromState.name, settings.fromState.params, { reload: false });
             }
         });
     };     

     self.close = function(settings) {
         modalInstance = null;
         isOpen = false;
     };
    }
})();
