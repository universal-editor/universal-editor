module.exports = {
  runTest: function(tools) {
    it('onLoadedItems', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueDropdownComponent = EditEntityStorage.getComponentBySetting('$categories_id');

      httpBackend.flush();

      expect(ueDropdownComponent.optionValues.length).toBe(4);
    });
  }
};