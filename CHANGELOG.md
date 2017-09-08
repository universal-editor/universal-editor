# Change log

## [Unreleased]

## 1.0.0-alpha7 - 2017-09-08 
### Added
* Added transport-section for `dataSource`;
* Added single or multiple sorting in ue-grid;
* Added sortable-setting for column of the ue-grid;
* Added d&d for values of the multiple ue-autocomplete;
* Added fields-parameter in requests when components load data;

### Changed
* ue-pagination can select the number of elements on the page.
* Restyled the parent node in D&D-section.
* Updated datepicker-library with [bootstrap-datetimepicker](https://eonasdan.github.io/bootstrap-datetimepicker/);
* `ue-textarea` in disabled mode displays text including spaces and line breaks;
* Optimized work of the d&d regim of the `ue-grid`;

### Fixed
* Fixed the putting id for html-element of the root component;
* Fixed logic for depend-setting of the component with remoting data;
* Fixed processing zero value in filter component `ue-string` with the numeric validation;
* Fixed removing primary key from data-section of the request before updating or presaving entity in `ue-form`;
* Fixed bug with sref parameter of component ue-button.

## 1.0.0-alpha6 - 2017-05-17 
### Added
* Added rejecting requests for `ue-button` for `ue-form`.
* Added drag and drop for `ue-grid` component.
* Added `useable` parameter for components.
* Added new parameter `primaryKeyValue` for configuring of ue-form.

### Changed
* Components with `valuesRemote` parameter can get values from API as objects and as ID.
* `sref` setting of `ue-button` can be as an objects with own parameters.

### Fixed
* Fixed bug with `parent_id` parameters of `dataSource` in `ue-grid`.
* Corrected work with `defaultValue` parameters and working of ue-dropdown with search parameter.
* Bug with sending of numerical `ue-string `in filter.
* Fixed bug with saving values of filters if you come back to the list from the form.

## 1.0.0-alpha5 - 2017-04-05
### Added
* Added an opportunity `ue-dropdown` and `ue-autocomplete` components to be connected with the same reference on configuration.
* Added preloader icon on button for `ue-form` component.
* Added validators for fields components.
* Added `sort` and `page` parameters of `ue-greed` component into URI.
* Added serice for work with server by JSONAPI standard.
* Added `serverPagination` parameter for `ue-dropdown` and `ue-autocomplete` components.

### Changed
* Changed naming of components for composite fields with points, for example composite field name for configuration: `contacts.[].value`.
* Changed filter format for composite fields, for example new format of query parameter: `?filter={"root.field":1}`.
* Renamed events.
* The parameter `standard` is mandatory for `dataSource`-object.

### Fixed
* Sending one request for `ue-grid` component during rendering the table.

## 1.0.0-alpha4 - 2017-03-01
### Added
* Allocated several basic controllers that are inherited controllers components.
* Added validators for fields components.

### Changed
* Changed the structure of the description of the config's editor.
* Change routing and states. Removed list and from constant states. Added setting routing and states in the config file.
* The editor has been split into components.
* Form's fields and filters united and extracted into separate components and renamed base on template `ue-<field>`.
* Button's united into one component `ue-button`.

### Removed
* Removed the ability to describe in a config several entities (one substance - one editor).

## 1.0.0-alpha3 - 2016-12-12

## 1.0.0-alpha2 - 2016-08-29

## 1.0.0-alpha - 2016-08-10
