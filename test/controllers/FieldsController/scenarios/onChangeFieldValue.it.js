module.exports = {
  runTest: function(tools) {
    it('onChangeFieldValue', function() {
      let httpBackend = tools.$injector.get('$httpBackend'),
        EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      httpBackend.flush();
      spyOn(ueStringComponent, 'onChangeFieldValue');
      scopeUeForm.$broadcast('ue:changeFieldValue', { configuration: null });

      expect(ueStringComponent.onChangeFieldValue).toHaveBeenCalled();
    });
  }
};