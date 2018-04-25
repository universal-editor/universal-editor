module.exports = {
  runTest: function(tools) {
    it('updateItem', function(done) {
      let request = {
          $componentId: 'grid',
          entityId: 35,
          options: {
            isLoading: false,
            $dataSource: new DataSource(tools.getDataSource())
          },
          notGoToState: true
        },
        ApiService = tools.$injector.get('ApiService'),
        $rootScope = tools.$injector.get('$rootScope'),
        httpBackend = tools.$injector.get('$httpBackend');

      ApiService.updateItem(request).then((response) => {
        expect(response.id).toBe(35);
        done();
      });
      httpBackend.flush();
    });
  }
};
