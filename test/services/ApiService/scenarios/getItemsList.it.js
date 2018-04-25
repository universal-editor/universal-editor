module.exports = {
  runTest: function (tools) {
    it('getItemsList', function (done) {
      let gridSettings = tools.getUeGridConfiguration(),
        request = {
          $componentId: 'grid',
          options: {
            isLoading: false,
            $dataSource: new DataSource(gridSettings.component.settings.dataSource)
          },
          params: {
            page: 2,
            'per-page': 30
          },
          sort: '-id'
        },
        ApiService = tools.$injector.get('ApiService'),
        controller = tools.createController(gridSettings),
        $rootScope = tools.$injector.get('$rootScope'),
        httpBackend = tools.$injector.get('$httpBackend');
        httpBackend.flush();

      ApiService.getItemsList(request).then((response) => {
        expect(response.items.length).toBe(4);
        expect(response._meta.pageCount).toBe(2);
        done();
      });
      httpBackend.flush();
    });
  }
};
