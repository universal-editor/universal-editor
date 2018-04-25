module.exports = {
  runTest: function(tools) {
    it('getPage', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        uePagination = tools.getUePaginationConfiguration(),
        $location = tools.$injector.get('$location');

      //case
      PaginationSettings.set('grid_id_1', uePagination.component.settings, 'new_prefix');
      PaginationSettings.setPage('grid_id_1', 5);
      expect(PaginationSettings.getPage('grid_id_1')).toBe(5);
    });
  }
};
