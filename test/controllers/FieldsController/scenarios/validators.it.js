module.exports = {
  runTest: function(tools) {
    it('General settings (setting validator)', function() {
      let ueFormSettings = tools.getConfigWithValidators(),
        EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$test_string');

      expect(ueStringComponent.minLength).toBe(3);
      expect(ueStringComponent.maxLength).toBe(300);
      expect(ueStringComponent.pattern).toBe('^[A-Za-z]+$');
      expect(ueStringComponent.trim).toBe(true);
      expect(ueStringComponent.contentType).toBe('text');

      expect(ueStringComponent.minNumber).toBe(3);
      expect(ueStringComponent.maxNumber).toBe(300);
      expect(ueStringComponent.stepNumber).toBe(2);

      expect(ueStringComponent.minDate).toBe('3-10-2012');
      expect(ueStringComponent.maxDate).toBe('8-12-2014');
      expect(ueStringComponent.minView).toBe('day');
      expect(ueStringComponent.maxView).toBe('year');
      expect(ueStringComponent.view).toBe('month');
      expect(ueStringComponent.format).toBe('DD-MM-YYYY');
    });
  }
};