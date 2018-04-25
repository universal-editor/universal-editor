let angular = window.angular;

import { ButtonsController } from './../controllers/Buttons.controller';
import { BaseController } from './../controllers/Base.controller';
import { FieldsController } from './../controllers/Fields.controller';

import { EditorHttpInterceptor } from './../editorHttpInterceptor.service';
import { MessagesService } from './../services/Messages.service';
import { YiiSoftApiService } from './../services/YiiSoft.service';
import { PaginationSettings } from './../services/PaginationSettings.service';
import { JSONAPIApiService } from './../services/JSONAPI.service';
import { EditEntityStorage } from './../services/EditEntityStorage.service';
import { FilterFieldsStorage } from './../services/FilterFieldsStorage.service';
import { ApiService } from './../services/Api.service';

import { ComponentBuilder } from './../factories/ComponentBuilder';

import { onRenderTemplate } from './../directives/renderTemplate.directive';

angular.module('universal-editor')

  // Controllers
  .controller('BaseController', BaseController)
  .controller('ButtonsController', ButtonsController)
  .controller('FieldsController', FieldsController)

  //Services
  .service('MessagesService', MessagesService)
  .service('ApiService', ApiService)
  .service('YiiSoftApiService', YiiSoftApiService)
  .service('PaginationSettings', PaginationSettings)
  .service('EditEntityStorage', EditEntityStorage)
  .service('FilterFieldsStorage', FilterFieldsStorage)
  .service('JSONAPIApiService', JSONAPIApiService)

  //Factories
  .factory('EditorHttpInterceptor', EditorHttpInterceptor)
  .factory('ComponentBuilder', ComponentBuilder)

  //Directories
  .directive('onRenderTemplate', onRenderTemplate);
