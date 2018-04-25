
/**
   * Base instrumental tools service for unit-tests.
   * You can add supported methods and use it in test logic.
   * Class is used for inheritance which is imported in the module.
   * @param  {$injector} $injector Angular service for injects of the dependences
   */
export default class BaseToolsService {
  constructor($injector) {
    if ($injector) {
      this.$injector = $injector;
      this.$rootScope = $injector.get('$rootScope');
      this.$compile = $injector.get('$compile');
    }
  }

  /**
   * Creates the component of universal-editor with configuration.
   * @param  {settings} settings Configuration of the something ue-component
   * @returns {object} Return isolated scope of the created component.
   */
  createController(settings) {
    var scope, element;
    scope = this.$rootScope.$new();
    scope.setting = settings;
    element = this.$compile('<component-wrapper setting="setting"></component-wrapper>')(scope);
    scope.$digest();
    return element.isolateScope();
  };

  createElement(settings) {
    var scope, element;
    scope = this.$rootScope.$new();
    scope.setting = settings;
    element = this.$compile('<component-wrapper setting="setting"></component-wrapper>')(scope);
    scope.$digest();
    return element;
  };

  expectObjects(fact, expected) {
    if (angular.isObject(fact) && angular.isObject(expected)) {
      expect(JSON.stringify(fact)).toBe(JSON.stringify(expected));
    }
  }
};
