module.exports = {
  runTest: function(tools) {
    it('Edit-template', function() {
      let ueStringSettings = {
        component: {
          name: 'ue-string',
          settings: {
            templates: {
              edit: function() {
                return '<input id="custom_template_component"></input>'
              }
            }
          }
        }
      },
      scopeUeString = tools.createElement(ueStringSettings);
      expect(scopeUeString.find('.component-edit #custom_template_component').length).toBe(1);
    });
  }
};
