module.exports = {
  runTest: function(tools) {
    it('onDestroyHandler', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings);

      scopeUeForm.$destroy();

      expect(EditEntityStorage.getComponentBySetting('$fio')).toBe(null);
    });
  }
};