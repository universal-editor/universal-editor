module.exports = {
  runTest: function(tools) {
    it('onForceReadonlyHandler', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField('/api/errorAnswer'),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      spyOn(ueStringComponent, 'onForceReadonlyHandler');
      scopeUeForm.$broadcast('ue-group:forceReadonly', {
        $componentId: '$form',
        value: true
      });

      expect(ueStringComponent.onForceReadonlyHandler).toHaveBeenCalled();
    });
  }
};