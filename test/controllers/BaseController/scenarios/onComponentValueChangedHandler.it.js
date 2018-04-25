module.exports = {
  runTest: function(tools) {
    it('onComponentValueChangedHandler', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField('/api/errorAnswer'),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      spyOn(ueStringComponent, 'onComponentValueChangedHandler');
      EditEntityStorage.updateComponents(scopeUeForm.setting.component.$id);

      expect(ueStringComponent.onComponentValueChangedHandler).toHaveBeenCalled();
    });
  }
};