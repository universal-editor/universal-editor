module.exports = {
  runTest: function(tools) {
    it('presaveItem', function(done) {
      let request = {
        $componentId: 'grid',
        entityId: 35,
        options: {
          isLoading: false,
          $dataSource: new DataSource(tools.getDataSource())
        },
        data: {
          id: 35,
          name: 'Category35'
        },
        notGoToState: true
      },
      ApiService = tools.$injector.get('ApiService'),
      $rootScope = tools.$injector.get('$rootScope'),
      httpBackend = tools.$injector.get('$httpBackend'),
      config;

      $rootScope.$on('ue:beforeEntityUpdate', function(data) {
        config = data;
      })
      ApiService.presaveItem(request).then((response) => {
        expect(request.data.id).toBe(undefined);
        expect(response.id).toBe(35);
        expect(config.name).toBe('ue:beforeEntityUpdate');
        done();
      });
      httpBackend.flush();
    });
  }
};
