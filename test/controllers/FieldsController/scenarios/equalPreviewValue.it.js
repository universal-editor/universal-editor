module.exports = {
  runTest: function(tools) {
    it('equalPreviewValue', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueDropdownComponent = EditEntityStorage.getComponentBySetting('$categories_id'),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      httpBackend.flush();
      ueDropdownComponent.equalPreviewValue();

      expect(ueDropdownComponent.previewValue).toBe('Category2');
      expect(ueStringComponent.previewValue).toBe('Petrov');
    });
  }
};