module.exports = {
  runTest: function(tools) {
    it('editEntityPresave', function() {
      let request = {
        $componentId: 'form',
        isError: false
      },
        ApiService = tools.$injector.get('ApiService'),
        presaveMethod = spyOn(ApiService, 'presaveItem'),
        formSettings = tools.getUeFormConfiguration2(),
        controller = tools.createController(formSettings),
        EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        $rootScope = tools.$injector.get('$rootScope');

      //case
      EditEntityStorage.editEntityPresave(request);
      expect(presaveMethod).toHaveBeenCalledWith(request);

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
      EditEntityStorage.editEntityPresave(request);
      expect(presaveMethod).not.toHaveBeenCalledWith(request);
    });

  }
};
