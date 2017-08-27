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

  // FIXME support the full entry spec: https://webpack.js.org/configuration/entry-context/#entry
  prependEntryPoints(customizers, entryConfig) {
    if (typeof entryConfig === 'string' || Array.isArray(entryConfig))
      return customizers.concat(entryConfig);

    const include = this.options.entryPoints ?
      (x => this.options.entryPoints.include(x)) :
      (x => true);

    const out = {};
    Object.entries(entryConfig).forEach(([k, v]) => {
      if (include(k)) {
        out[k] = customizers.concat(v)
      } else {
        out[k] = v
      }
    })
    return out;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.options.entry = this.prependEntryPoints(
        this.getCustomizers(),
        compilation.options.entry
      );
      console.log("ENTRY", compilation.options.entry);
    });

    compiler.apply(new webpack.ProvidePlugin({
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    }));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
