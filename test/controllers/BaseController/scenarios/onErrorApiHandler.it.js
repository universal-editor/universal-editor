module.exports = {
  runTest: function(tools) {
    it('onErrorApiHandler', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
      ueFormSettings = tools.getDefaultUeFormSettingsWithOneField('/api/errorAnswer'),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');
      
      spyOn(ueStringComponent, 'onErrorApiHandler');
  
      scopeUeForm.$broadcast('ue:componentError', {
        "$componentId": ueFormSettings.component.$id,
        "data": [
          {
            "field": "fio",
            "message": "Необходимо заполнить «fio»."
          }
        ]
      });    
      expect(ueStringComponent.onErrorApiHandler).toHaveBeenCalled();
    });
  }
};