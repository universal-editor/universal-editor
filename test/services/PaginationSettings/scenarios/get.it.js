module.exports = {
  runTest: function(tools) {
    it('get', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        uePagination = tools.getUePaginationConfiguration(),
        fact, expected;

      //case
      fact = PaginationSettings.set('grid_id_1', uePagination.component.settings);
      expected = {
        prefixGrid: false,
        pageSizeOptions: [10, 20, 30, 40, 50, 100],
        pageSize: 30
      };
      expect(PaginationSettings.get('grid_id_1')).toBe(fact);
    });
  }
};
