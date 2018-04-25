module.exports = {
  runTest: function(tools) {
    it('Filter-template', function() {
      let ueFormSettings = tools.getExtendedUeGridConfiguration();
      let httpBackend = tools.$injector.get('$httpBackend');
      ueFormSettings.component.settings.header.toolbar[0].component.settings = {
        fields: [{
          component: {
            name: 'ue-string',
            settings: {
              mode: 'filter',
              templates: {
                filter: function() {
                  return '<input id="custom_template_component"></input>'
                }
              }
            }
          }
        }]
      };

      let elementUeForm = tools.createElement(ueFormSettings);
      httpBackend.flush();

      expect(elementUeForm.find('.component-filter #custom_template_component').length).toBe(1);
    });
  }
};
