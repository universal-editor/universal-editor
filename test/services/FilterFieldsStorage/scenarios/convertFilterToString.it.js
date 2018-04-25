module.exports = {
  runTest: function(tools) {
    it('convertFilterToString', function() {
      let FilterFieldsStorage = tools.$injector.get('FilterFieldsStorage');
      expect(
        JSON.stringify(
          JSON.parse(
            FilterFieldsStorage.convertFilterToString({
              "id": [
                {
                  "operator": ":value",
                  "value": 5
                }
              ],
              "title": [
                {
                  "operator": "%:value%",
                  "value": "Title1"
                }
              ],
              "created": [
                {
                  "operator": ">=:key",
                  "value": "12.05.2012"
                },
                {
                  "operator": "<=:key",
                  "value": "12.05.2015"
                }
              ]
            })
          )
        )
      )
        .toBe('{"id":5,"title":"%Title1%",">=created":"12.05.2012","<=created":"12.05.2015"}');
    });
  }
};
