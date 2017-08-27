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
    if (!isObject(entryConfig)) {
      throw `Unsupported entry type: ${typeof entryConfig}. Currently supported types are string and [string].`
    }
    if (!Array.isArray(entryConfig)) {
      // assume entry: <string>
      entryConfig = [entryConfig]
    }
    return customizers.concat(entryConfig);
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.options.entry = this.prependEntryPoints(
        this.getCustomizers(),
        compilation.options.entry
      )
    });

    compiler.apply(new webpack.ProvidePlugin({
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    }));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
