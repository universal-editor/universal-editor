module.exports = {
  runTest: function(tools) {
    it('getParams', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService'),
        config, expected;

      //case
      config = {
        params: {
          fields: 'id,title'
        }
      };
      tools.expectObjects(YiiSoftApiService.getParams(config), config.params);

      //case
      config = {
        params: {}
      };
      expect(YiiSoftApiService.getParams(config)).toBeUndefined();

      //case
      config = {
        action: 'read',
        pagination: {
          perPage: 100
        },
        params: {
          fields: 'id,title'
        }
      };
      expected = {
        fields: 'id,title',
        'per-page': 100
      };
      tools.expectObjects(YiiSoftApiService.getParams(config), expected);

      //case
      config = {
        action: 'one',
        pagination: {
          perPage: 100
        },
        params: {
          fields: 'id,title'
        }
      };
      expected = {
        fields: 'id,title'
      };

      tools.expectObjects(YiiSoftApiService.getParams(config), expected);

      //case
      config = {
        action: 'one',
        pagination: {
          perPage: 100
        },
        filter: {
          id: [
            {
              operator: ':value',
              value: 2563
            }
          ]
        },
        $dataSource: {
          fields: [
            { name: 'id' },
            { name: 'title' },
            {
              name: 'comment',
              component: {
                settings: {
                  expandable: true
                }
              }
            },
          ]
        }
      };
      expected = {
        expand: 'comment',
        fields: 'id,title,comment',
        filter: '{"id":2563}'
      };

      tools.expectObjects(YiiSoftApiService.getParams(config), expected);

      //case
      config = {
        action: 'one'
      };

      spyOn(YiiSoftApiService, 'setFiltering');
      spyOn(YiiSoftApiService, 'setExpands');
      spyOn(YiiSoftApiService, 'setPagination');

      YiiSoftApiService.getParams(config);

      expect(YiiSoftApiService.setFiltering).toHaveBeenCalled();
      expect(YiiSoftApiService.setExpands).toHaveBeenCalled();
      expect(YiiSoftApiService.setPagination).not.toHaveBeenCalled();

      //case
      config = {
        action: 'read'
      };

      YiiSoftApiService.getParams(config);

      expect(YiiSoftApiService.setFiltering).toHaveBeenCalled();
      expect(YiiSoftApiService.setExpands).toHaveBeenCalled();
      expect(YiiSoftApiService.setPagination).toHaveBeenCalled();

    });
  }
};
