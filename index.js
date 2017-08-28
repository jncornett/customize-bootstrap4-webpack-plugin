const webpack = require('webpack');
const EntryOptionPlugin = require('webpack/lib/EntryOptionPlugin');

const defaults = { customStyle: null };

function prepend(prependers, entry) {
  let newEntry = null;
	if(typeof entry === "string" || Array.isArray(entry)) {
    newEntry = prependers.concat(entry);
	} else if(typeof entry === "object") {
    newEntry = {};
    Object.keys(entry).forEach(name => {
      newEntry[name] = prepend(prependers, entry[name])
    })
	} else if(typeof entry === "function") {
    newEntry = () => Promise.resolve(entry()).then(e => prepend(prependers, e))
	}
  return newEntry;
}

class CustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
  }

  apply(compiler) {
    console.log('ENTRY OPTION PLUGIN', EntryOptionPlugin);
    compiler.plugin('entry-option', (context, entry) => {
      compiler.apply(new EntryOptionPlugin());
      return false;
    });

    const provideConfig = {
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    };

    compiler.apply(new webpack.ProvidePlugin(provideConfig));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
