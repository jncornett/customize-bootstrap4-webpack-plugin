const path = require('path');

const webpack = require('webpack');

const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const DynamicEntryPlugin = require("webpack/lib/DynamicEntryPlugin");

const pkg = require('./package.json');

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

const CUSTOM_STYLE_ALIAS = '__customize_bootstrap4_webpack_plugin_style';

const defaults = {
  customStyle: null,
  __defaultPrependers: [
    path.join(pkg.name, 'entry'),
    path.join(pkg.name, 'entry.scss')
  ]
};

class XCustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
  }

  apply(compiler) {
    /*
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
    */
    compiler.plugin('normal-module-factory', normalModuleFactory => {
      normalModuleFactory.plugin('before-resolve', (result, callback) => {
        console.log('BEFORE', result, callback);
        return callback(null, result);
      });
      normalModuleFactory.plugin('after-resolve', (result, callback) => {
        console.log('AFTER', result, callback);
        return callback(null, result);
      })
    });

    const provideConfig = {
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    };

    compiler.apply(new webpack.ProvidePlugin(provideConfig));
  }
}

class CustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    if (typeof options === 'string')
      options = { customStyle: options };

    this.options = options;
  }

  apply(compiler) {

    const provideConfig = {
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js',
    };

    if (this.options.customStyle)
      provideConfig[CUSTOM_STYLE_ALIAS] = this.options.customStyle;

    compiler.apply(new webpack.ProvidePlugin(provideConfig));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
