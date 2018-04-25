module.exports = {
  runTest: function(tools) {
    it('GetParentSettings', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');
      let setting = ueStringComponent.getParentSetting();
      expect(setting.component.$id).toBe(ueFormSettings.component.$id);
    });
  }
};
