const webpack = require('webpack');

// source: https://stackoverflow.com/a/40667053/1142167
function isObject(o) {
  return null != o &&
    typeof o === 'object' &&
    Object.prototype.toString.call(o) === '[object Object]';
}

const defaults = {
  customizers: null,
  entryPoints: null
};

const defaultCustomizers = ['customize-bootstrap4-webpack-plugin/entry'];

class CustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
  }

  getCustomizers() {
    const customizers = this.options.customizers || [];
    return defaultCustomizers.concat(Array.isArray(customizers) ? customizers : [customizers]);
  }

  prependEntryPoints(customizers, entryPoints) {
    const out = [].concat(entryPoints);
    out.splice(out.length - 1, 0, ...customizers);
    return out;
  }

  // FIXME support the full entry spec: https://webpack.js.org/configuration/entry-context/#entry
  updateEntry(customizers, entryConfig) {
    if (typeof entryConfig === 'string' || Array.isArray(entryConfig))
      return this.prependEntryPoints(customizers, entryConfig);

    const include = this.options.entryPoints ?
      (x => this.options.entryPoints.include(x)) :
      (x => true);

    const out = {};
    Object.entries(entryConfig).forEach(([k, v]) => {
      if (include(k)) {
        out[k] = this.prependEntryPoints(customizers, v)
      } else {
        out[k] = v
      }
    })
    return out;
  }

  apply(compiler) {
    /*
    compiler.plugin('compilation', compilation => {
      compilation.options.entry = this.updateEntry(
        this.getCustomizers(),
        compilation.options.entry
      );
      console.log("ENTRY", compilation.options.entry);
    });
    */
    compiler.plugin('entry-option', (context, entry) => {
      console.log('ENTRY', context, entry);
      return true;
    });

    compiler.apply(new webpack.ProvidePlugin({
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    }));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
