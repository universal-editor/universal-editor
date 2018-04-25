module.exports = {
  runTest: function(tools) {
    it('onErrorComponentDataLoadingHandler', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField('/api/errorAnswer'),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      spyOn(ueStringComponent, 'onErrorComponentDataLoadingHandler');
      scopeUeForm.$broadcast('ue:errorComponentDataLoading', {
        status: 400,
        $componentId: '$fio',
        config: {
          canceled: false
        }
      });

      expect(ueStringComponent.onErrorComponentDataLoadingHandler).toHaveBeenCalled();
    });
  }
};