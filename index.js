const webpack = require('webpack');

const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const DynamicEntryPlugin = require("webpack/lib/DynamicEntryPlugin");

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

function itemToPlugin(context, item, name) {
	if(Array.isArray(item)) {
		return new MultiEntryPlugin(context, item, name);
	}
	return new SingleEntryPlugin(context, item, name);
}

const defaults = { customStyle: null };

class CustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
  }

  apply(compiler) {
    compiler.plugin('entry-option', (context, entry) => {
      if (this.options.customStyle) {
        entry = prepend([].concat(this.options.customStyle), entry)
      }

			if(typeof entry === "string" || Array.isArray(entry)) {
				compiler.apply(itemToPlugin(context, entry, "main"));
			} else if(typeof entry === "object") {
				Object.keys(entry).forEach(name => compiler.apply(itemToPlugin(context, entry[name], name)));
			} else if(typeof entry === "function") {
				compiler.apply(new DynamicEntryPlugin(context, entry));
			}
      return true;
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
