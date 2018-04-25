module.exports = {
  runTest: function(tools) {
    it('setPagination', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService');

      //case
      let config = {
        pagination: {
          page: 5,
          perPage: 20
        }
      },
      filterQueryObject = YiiSoftApiService.setPagination(config);
      tools.expectObjects(filterQueryObject, {
        page: 5,
        'per-page': 20
      });

      //case
      config = {
        filter: {
          expand: 'comments'
        },
        pagination: {
          page: 5,
          perPage: 20
        }
      };
      YiiSoftApiService.setFiltering(config);
      tools.expectObjects(config.params.filter, {
        expand: 'comments',
        page: 5,
        perPage: 20
      });
    });
  }
};
