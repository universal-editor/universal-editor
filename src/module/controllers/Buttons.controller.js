let angular = window.angular;

/**
  *  Base controller for the custom ue-button components.
  */
class ButtonsController {
  constructor($scope, $controller, $element, $templateCache, $translate) {
    'ngInject';
    this.$scope = $scope;
    this.$controller = $controller;
    this.$element = $element;
    this.$templateCache = $templateCache;
    this.$translate = $translate;
    this.$onInit();
  }
  $onInit() {
    var self = this,
      componentSettings = self.$scope.vm.setting.component.settings,
      htmlPattern = /[^\s]+(?=\.html$)/;

    // Inherited from BaseController
    self.$controller('BaseController', { $scope: self.$scope, $element: self.$element });
    angular.extend(self, self.$scope.vm);

    // Supporting settings
    self.setting.inline = true;
    self.type = self.setting.type;
    self.entityId = self.setting.entityId;

    /**
     *  Initialize general settings for the button
     *  @param {Function, string} tempate Setting for templates of the component.
     */
    self.template = componentSettings.template;

    if (angular.isString(self.template) || angular.isFunction(self.template)) {
      var template = self.template;
      if (angular.isFunction(self.template)) {
        self.template = self.template(self.$scope);
      }
      if (self.template && htmlPattern.test(self.template)) {
        self.template = self.$templateCache.get(template);
        if (self.template === undefined) {
          self.$translate('ERROR.FIELD.TEMPLATE').then(function(translation) {
            console.warn(translation.replace('%template', template));
          });
        }
      }
    }
  }
}
export { ButtonsController };
