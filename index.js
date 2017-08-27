const webpack = require('webpack');

class CustomizeBootstrap4WebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.mainTemplate.plugin('render-with-entry', (source, chunk) => {
        source.add('\n// Added this line!\n');
      })
    });
    
    compiler.apply(new webpack.ProvidePlugin({
      // required for bootstrap
      jQuery: 'jquery',
      Popper: 'popper.js'
    }));
  }
}

module.exports = CustomizeBootstrap4WebpackPlugin;
