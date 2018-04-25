module.exports = {
  runTest: function(tools) {
    it('getComponentBySetting', function() {
      let formSettings = tools.getUeFormConfiguration(),
         controller = tools.createController(formSettings),
         EditEntityStorage = tools.$injector.get('EditEntityStorage'),
         httpBackend = tools.$injector.get('$httpBackend');

      expect(EditEntityStorage.getComponentBySetting('list').fieldName).toBe('list');
      httpBackend.flush();
    });
  }
};
