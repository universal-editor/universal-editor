module.exports = {
  runTest: function(tools) {
    it('toConvertSortingString', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService'),
        fact, expected;

      //case
      fact = YiiSoftApiService.toConvertSortingString('-fio, person.age, -person.dateBirth');
      expected = {
        fio: "desc",
        person: {
          age: "asc",
          dateBirth: "desc"
        }
      };
      tools.expectObjects(fact, expected);

      //case
      fact = YiiSoftApiService.toConvertSortingString('  -fio,   person.age,    -person.dateBirth  ');
      tools.expectObjects(fact, expected);

      //case
      fact = YiiSoftApiService.toConvertSortingString('');
      tools.expectObjects(fact, {});

      //case
      fact = YiiSoftApiService.toConvertSortingString('-fio');
      expected = { fio: "desc" };
      tools.expectObjects(fact, expected);
    });
  }
};
