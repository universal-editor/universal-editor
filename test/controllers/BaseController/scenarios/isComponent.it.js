module.exports = {
  runTest: function(tools) {
    it('isComponent', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      expect(ueStringComponent.isComponent(ueStringComponent.setting.component)).toBe(true);
      expect(ueStringComponent.isComponent(ueStringComponent.setting.component.$id)).toBe(true);
    });
  }
};
