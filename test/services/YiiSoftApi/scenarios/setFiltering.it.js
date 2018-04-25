module.exports = {
  runTest: function(tools) {
    it('setFiltering', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService');

      //case
      let config = {
        filter: {
          id: [
            {
              operator: ':value',
              value: 2563
            }
          ],
          prop: [
            {
              operator: '%:value%',
              value: 'Value'
            }
          ],
          title: [
            {
              operator: '%:value%',
              value: 'Title'
            }
          ],
          created: [
            {
              operator: '>=:key',
              value: '25.05.2015'
            },
            {
              operator: '<=:key',
              value: '28.05.2015'
            }
          ]
        }
      },
      filterQueryObject = YiiSoftApiService.setFiltering(config),
      fact = {
        id: 2563,
        prop: '%Value%',
        title: '%Title%',
        '>=created': '25.05.2015',
        '<=created': '28.05.2015'
      };
      tools.expectObjects(filterQueryObject, fact);
      expect(config.params.filter, JSON.stringify(fact));

      //case
      config = {
        filter: {}
      },
      filterQueryObject = YiiSoftApiService.setFiltering(config),
      fact = {};
      tools.expectObjects(filterQueryObject, fact);
      expect(config.params.filter).toBeUndefined();
    });
  }
};
