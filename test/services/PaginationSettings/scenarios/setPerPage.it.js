module.exports = {
  runTest: function(tools) {
    it('setPerPage', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        uePagination = tools.getUePaginationConfiguration(),
        $location = tools.$injector.get('$location');

      //case
      PaginationSettings.set('grid_id_1', uePagination.component.settings, 'new_prefix');
      PaginationSettings.setPerPage('grid_id_1', 50);
      expect($location.search()['new_prefix-per-page']).toBe(50);
      expect(PaginationSettings.get('grid_id_1').pageSize).toBe(50);
    });
  }
};
