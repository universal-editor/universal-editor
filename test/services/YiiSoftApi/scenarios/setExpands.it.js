module.exports = {
  runTest: function(tools) {
    it('setExpands', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService'),
        config = {
          $dataSource: {
            tree: {
              childrenField: 'children'
            },
            fields: [
              getFieldConfiguration('title', true),
              getFieldConfiguration('comment', true),
              getFieldConfiguration('array[]', true),
              getFieldConfiguration('array[].id', true),
              getFieldConfiguration('array[].name', true),
              getFieldConfiguration('id', false)
            ]
          }
        };

      //case
      let expandFields = YiiSoftApiService.setExpands(config);
      tools.expectObjects(expandFields, ['title', 'comment', 'array', 'children']);
      expect(config.params.expand).toBe(expandFields.toString());

      //case
      YiiSoftApiService.setExpands({});
      tools.expectObjects(YiiSoftApiService.setExpands({}), []);

      //case
      config.$dataSource.fields.length = 0;
      delete config.params;
      delete config.$dataSource.tree;
      tools.expectObjects(YiiSoftApiService.setExpands(config), []);
      expect(config.params).toBeUndefined();


      function getFieldConfiguration(name, expandable) {
        return {
          name: name,
          component: {
            settings: {
              expandable: expandable
            }
          }
        }
      }

    });
  }
};
