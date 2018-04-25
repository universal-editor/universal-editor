module.exports = {
  runTest: function(tools) {
    it('General settings', function() {
      let httpBackend = tools.$injector.get('$httpBackend'),
        EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueDropdownComponent = EditEntityStorage.getComponentBySetting('$categories_id');

      httpBackend.flush();

      expect(ueDropdownComponent.multiname).toBe(null);
      expect(ueDropdownComponent.width).toBe(10);
      expect(ueDropdownComponent.placeholder).toBe('Category2');
      expect(ueDropdownComponent.defaultValue).toBe(2);
      expect(ueDropdownComponent.classComponent).toBe('col-lg-10 col-md-10 col-sm-10 col-xs-10 clear-padding-left');
      expect(ueDropdownComponent.setting.component.settings.valuesRemote.$loadingPromise).toBeDefined();
      expect(ueDropdownComponent.serverPagination).toBe(true);
      expect(ueDropdownComponent.setting.component.settings.valuesRemote.$selectedStorage.length).toBe(1);
    });
  }
};