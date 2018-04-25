module.exports = {
  runTest: function(tools) {
    it('inputLeave', function(done) {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        $timeout = tools.$injector.get('$timeout'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio');

      httpBackend.flush();
      ueStringComponent.inputLeave('ab');
      ueStringComponent.inputLeave('Very very long text');

      $timeout(function() {
        expect(ueStringComponent.clientErrors[0]).toBe('Минимальное значение поля не может быть меньше 3 символов. Сейчас введено 2 символов.');
        expect(ueStringComponent.clientErrors[1]).toBe('Для поля превышено максимальное допустимое значение в 10 символов. Сейчас введено 19 символов.');
        done();
      });
      $timeout.flush();
    });
  }
};