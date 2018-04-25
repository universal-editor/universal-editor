module.exports = {
  runTest: function(tools) {
    it('resetErrors', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      //Mocks for errors inside component
      ueStringComponent.dangers = [{ text: 'Ошибка сервера при запросе данных.' }];
      ueStringComponent.warnings = [{ text: 'Ошибка' }];
      ueStringComponent.error = ['Ошибка'];

      ueStringComponent.resetErrors();

      expect(ueStringComponent.error.length).toBe(0);
      expect(ueStringComponent.warnings.length).toBe(0);
      expect(ueStringComponent.dangers.length).toBe(0);
    });
  }
};