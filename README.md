# NineJS

A library for building single-page websites. It contains a lot of tools to help you build applications.
## Installation
**npm**
    npm install ninejs

**Clone from source control**

    git clone git@github.com:ninejs/ninejs.git




## Getting Started

Inside NineJS you can find the following: (Visit each folder to get a more in-context documentation)

- **core**: Modules to help you build core stuff, such as creating classes in an OOP way, adding to such classes a `obj.get('propName')` and `obj.set('propName', value)` behavior, building a boolean expression, etc.
- **css**: Module to help you inject CSS in your application. It is best used with dojo toolkit's builder.
- **lib**: CLI module for Node.js
- **modules**: Tools to help you create NineJS modules and some pre-made modules too.
- **nineplate**: turns XML templates (HTML too) into javascript functions that render either DOM nodes or text based on a parameter context. Can be optimized in a Dojo Build.
- **server**: modules and classes used to work on server-side (Node.js)
- **ui**: Modules and Widgets to help you build your app.

## Client side

You can run it on Dojo toolkit without needing anything else but dojo.
You can also run it on requirejs but you would need the following:
- kriskowal/q under the AMD prefix `q`
- ded/reqwest under the AMD prefix `reqwest`

If you run this on node.js those dependencies come already bundled in.

## License

NineJS is licensed under the [MIT](LICENSE "MIT") license.
