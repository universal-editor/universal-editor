module.exports = {
  runTest: function(tools) {
    it('GetParentSettings', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');
        expect(ueStringComponent.getParentComponent().setting.component.$id).toBe(ueFormSettings.component.$id);
    });
  }
};
