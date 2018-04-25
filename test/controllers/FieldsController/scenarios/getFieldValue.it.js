module.exports = {
  runTest: function(tools) {
    it('getFieldValue', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueDropdownComponent = EditEntityStorage.getComponentBySetting('$categories_id');

      httpBackend.flush();

      let value = ueDropdownComponent.getFieldValue(),
        extendedValue = ueDropdownComponent.getFieldValue(true);

      expect(JSON.stringify(value)).toBe(JSON.stringify({ "categories_id": 2 }));
      expect(JSON.stringify(extendedValue)).toBe(JSON.stringify({ "categories_id": { "id": 2, "title": "Category2" } }));
    });
  }
};