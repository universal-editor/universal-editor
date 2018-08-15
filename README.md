[![Build Status](https://travis-ci.org/universal-editor/universal-editor.svg?branch=master)](https://travis-ci.org/universal-editor/universal-editor)

# Universal editor

Universal editor to edit the entities from RESTful service.

## Building

Recommendation: running console with Administrator permissions. Address http://universal-editor.test is including into host file and open in browser.
If don't running console this way, have to enter http://universal-editor.test in host file manually as new line like this

127.0.0.1 universal-editor.test

For testing the application you need to install `karma-cli` globally with command

`npm install -g karma-cli`

Install dependencies:

1. `npm install`
1. `bower install`

Run build:

* `npm run dev`: build and watch sources, create web server. 
* `npm run dev --prod`: build minified version and watch sources, create web server.
* `npm run build`: build to `./dist` directory.
* `npm run test`: run unit-tests of the application.

## Documentation

* [По-русски](docs/ru/README.md).
