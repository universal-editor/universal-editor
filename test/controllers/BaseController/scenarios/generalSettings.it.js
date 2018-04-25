module.exports = {
  runTest: function(tools) {
    it('General settings', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');
      
      expect(ueStringComponent.label).toBe('FIO');
      expect(ueStringComponent.useable).toBe(true);
      expect(ueStringComponent.readonly).toBe(false);
      expect(ueStringComponent.regim).toBe('edit');
      expect(ueStringComponent.hint).toBe('Hint');
      expect(ueStringComponent.required).toBe(true);
      expect(ueStringComponent.multiple).toBe(false);
    });
  }
};
