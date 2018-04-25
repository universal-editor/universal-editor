module.exports = {
  runTest: function(tools) {
    it('onForceUseableHandler', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField('/api/errorAnswer'),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      spyOn(ueStringComponent, 'onForceUseableHandler');
      scopeUeForm.$broadcast('ue-group:forceUseable', {
        $componentId: '$form',
        value: true
      });

      expect(ueStringComponent.onForceUseableHandler).toHaveBeenCalled();
    });
  }
};