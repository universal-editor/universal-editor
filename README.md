# Universal editor

Universal editor to edit the entities from RESTful service.

## Building

Recommendation: running console with Administrator permissions. Address http://universal-editor.dev is including into host file and open in browser.
If don't running console this way, have to enter http://universal-editor.dev in host file manually as new line like this

127.0.0.1 universal-editor.dev


Install dependences:

1. `npm install`
1. `bower install`

Run build:

* `npm run serve`: build and watch sources, create web server. 
* `npm run serve:dist`: build production and create web server.
* `npm run build`: build to `/dist` directory.
* `npm run dev`: build to `/app` directory.

if you running local server by command `webpack-dev-server` or `webpack-dev-server -p` then config.js with test configuration is included in the bundle.


## Documentation

* [По-русски](docs/ru/README.md).
