# Angular UI to visualize json-schemata

A smallish angular based tool to visualize json-schemata from the web using an emscripten compile of graphviz.

Everything gets displayed as a node with directed edges pointing to the inner node. Nodes of the type `object` that do not contain further properties get marked red so we can find them easier.

## Development

Run npm and gulp and you should be good to go.

``bash
npm install
gulp serve
``

## Deploy

Build everything using gulp and deploy the dist folder.

``bash
npm install
gulp build
rsync --recursive dist/ production.example.com:/path/to/webroot
``
