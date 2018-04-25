module.exports = {
  runTest: function(tools) {
    it('getPerPage', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        uePagination = tools.getUePaginationConfiguration(),
        $location = tools.$injector.get('$location');

      //case
      PaginationSettings.set('grid_id_1', uePagination.component.settings, 'new_prefix');
      PaginationSettings.setPerPage('grid_id_1', 50);
      expect(PaginationSettings.getPerPage('grid_id_1')).toBe(50);
    });
  }
};
