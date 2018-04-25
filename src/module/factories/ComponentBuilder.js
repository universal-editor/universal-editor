function ComponentBuilder($compile) {
  'ngInject';

  function Component(scope) {
    scope.setting.component.$id = scope.setting.component.$id || getRandomId();
    this.scope = scope.$new();
    this.scope.setting = scope.setting;
    this.scope.options = scope.options;
  }

  // Builds HTML-element of the component according to name which is taken from configuration.
  Component.prototype.build = function() {
    var element = '<' + this.scope.setting.component.name + ' id="' + this.scope.setting.component.$id + '" class="field-wrapper-' + this.scope.setting.component.name + '" data-setting="::setting" data-options="::options"></' + this.scope.setting.component.name + '>';
    return $compile(element)(this.scope);
  };

  function getRandomId() {
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        var r = Math.random() * 16 | 0, //eslint-disable-line no-bitwise
          v = c == 'x' ? r : r & 0x3 | 0x8;//eslint-disable-line no-bitwise
        return v.toString(16);
      }
    );
  }
  return Component;
}

export { ComponentBuilder };
