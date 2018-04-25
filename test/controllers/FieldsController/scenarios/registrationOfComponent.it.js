module.exports = {
  runTest: function(tools) {
    it('Registration of component', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings);

      httpBackend.flush();

      expect(EditEntityStorage.getComponentBySetting('$categories_id')).toBeDefined();
    });
  }
};
