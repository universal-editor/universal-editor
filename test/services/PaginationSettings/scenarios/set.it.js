module.exports = {
  runTest: function(tools) {
    it('set', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        $location = tools.$injector.get('$location'),
        uePagination = tools.getUePaginationConfiguration(),
        fact, expected;

      //case
      fact = PaginationSettings.set('grid_id_1', uePagination.component.settings);
      expected = {
        prefixGrid: false,
        pageSizeOptions: [10, 20, 30, 40, 50, 100],
        pageSize: 30
      };
      tools.expectObjects(fact, expected);
      expect($location.search()['per-page']).toBe(30);

      //case
      delete uePagination.component.settings.pageSizeOptions;
      delete uePagination.component.settings.pageSize;
      fact = PaginationSettings.set('grid_id_1', uePagination.component.settings);
      expected = {
        prefixGrid: false,
        pageSizeOptions: [10, 20, 50],
        pageSize: 20
      };
      tools.expectObjects(fact, expected);

      //case
      uePagination = tools.getUePaginationConfiguration();
      fact = PaginationSettings.set('grid_id_3', uePagination.component.settings, 'grid');
      expected = {
        prefixGrid: 'grid',
        pageSizeOptions: [10, 20, 30, 40, 50, 100],
        pageSize: 30
      };
      tools.expectObjects(fact, expected);
      expect($location.search()['grid-per-page']).toBe(30);
    });
  }
};
