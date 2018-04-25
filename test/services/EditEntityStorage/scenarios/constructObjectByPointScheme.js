module.exports = {
  runTest: function(tools) {
    it('constructObjectByPointScheme', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        fact, expected;

      //case
      fact = EditEntityStorage.constructObjectByPointScheme('person.parent.surname', 'Petrov', { id: 12563 });
      expected = {
        id: 12563,
        person: {
          parent: {
            surname: 'Petrov'
          }
        }
      };
      tools.expectObjects(fact, expected);

      //case
      fact = EditEntityStorage.constructObjectByPointScheme('person.parent.surname', 'Petrov');
      expected = {
        person: {
          parent: {
            surname: 'Petrov'
          }
        }
      };
      tools.expectObjects(fact, expected);

      //case
      fact = EditEntityStorage.constructObjectByPointScheme('person.parent.surname');
      expected = {
        person: {
          parent: {
            surname: undefined
          }
        }
      };
      tools.expectObjects(fact, expected);

      //case
      fact = EditEntityStorage.constructObjectByPointScheme('');
      tools.expectObjects(fact, {});
    });
  }
};
