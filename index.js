const webpack = require('webpack');

class CustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      console.log('HOOK compile', compilation);
    });

    compiler.apply(new webpack.ProvidePlugin({
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    }));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
