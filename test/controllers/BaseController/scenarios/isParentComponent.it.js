module.exports = {
  runTest: function(tools) {
    it('isParentComponent', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      expect(ueStringComponent.isParentComponent(ueFormSettings.component)).toBe(true);
      expect(ueStringComponent.isParentComponent(ueFormSettings.component.$id)).toBe(true);
    });
  }
};
