module.exports = {
  runTest: function(tools) {
    it('editEntityUpdate', function() {
      let formSettings = tools.getUeFormConfiguration2(),
        controller = tools.createController(formSettings),
        ApiService = tools.$injector.get('ApiService'),
        addMethod = spyOn(ApiService, 'addNewItem'),
        updateMethod = spyOn(ApiService, 'updateItem'),
        $rootScope = tools.$injector.get('$rootScope'),
        EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        request = {
          $componentId: 'form',
          isError: false
        };

      //case
      EditEntityStorage.editEntityUpdate('create', request);
      expect(addMethod).toHaveBeenCalledWith(request);

      //case
      request = {
        $componentId: 'form',
        isError: false
      }
      EditEntityStorage.editEntityUpdate('update', request);
      expect(updateMethod).toHaveBeenCalledWith(request);

      //case
      $rootScope.$broadcast('ue:componentError', {
        $componentId: 'form',
        data: [
          {
            field: 'string.field',
            message: 'Error'
          }
        ]
      });

      request = {
        $componentId: 'form',
        isError: false
      }

      EditEntityStorage.editEntityUpdate('create', request);
      EditEntityStorage.editEntityUpdate('update', request);

      expect(addMethod).not.toHaveBeenCalledWith(request);
      expect(updateMethod).not.toHaveBeenCalledWith(request);
    });
  }
};
