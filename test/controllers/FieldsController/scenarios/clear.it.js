module.exports = {
  runTest: function(tools) {
    it('clear', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      httpBackend.flush();
      ueStringComponent.clear();
      
      expect(ueStringComponent.fieldValue).toBe(null);
    });
  }
};