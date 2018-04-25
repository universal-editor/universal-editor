module.exports = {
  runTest: function(tools) {
    it('setPage', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        uePagination = tools.getUePaginationConfiguration(),
        $location = tools.$injector.get('$location');

      //case
      PaginationSettings.set('grid_id_1', uePagination.component.settings, 'new_prefix');
      PaginationSettings.setPage('grid_id_1', 5);
      expect($location.search()['new_prefix-page']).toBe(5);
      expect(PaginationSettings.get('grid_id_1').page).toBe(5);
    });
  }
};
