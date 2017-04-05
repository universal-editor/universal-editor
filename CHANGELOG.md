# Change log

## [Unreleased]

## 1.0.0-alpha5
### Added
* Added an opportunity `ue-dropdown` and `ue-autocomplete` components to be connected with the same reference on configuration;
* Added add preloader icon on button for ue-form component;
* Changed naming of components for composite fields with points;
* Changed filter format for composite fields;
* Added validators for fields components;
* Made code refactoring of events model;
* Moved sort and page parameter to address string;
* Added serice for work with `JSONAPI`;
* Sending one request for `ue-grid` component during rendering the table.
* Made parameter `serverPagination` for ue-dropdown and ue-autocomplete components.
* Made parameter `type` for `datasource`-object required.

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
