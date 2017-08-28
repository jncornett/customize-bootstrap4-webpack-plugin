const webpack = require('webpack');

const defaults = { };

class CustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
  }

  apply(compiler) {
    compiler.plugin('entry-option', (context, entry) => {
      console.log('ENTRY', context, entry);
      return false;
    })
    const provideConfig = {
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    };

    compiler.apply(new webpack.ProvidePlugin(provideConfig));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
