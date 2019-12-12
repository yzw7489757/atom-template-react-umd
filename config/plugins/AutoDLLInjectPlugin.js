/* A plugin to compitible html-webpack-plugin v4 otherwise failed of injection */

let fs = require("fs");
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");

function getAutoDLLFiles() {
  // cacheDir : projectPath\node_modules\.cache\autodll-webpack-plugin
  var cacheDir = require("autodll-webpack-plugin/node_modules/find-cache-dir")({
    name: "autodll-webpack-plugin"
  });// 获取插件缓存目录

  if (cacheDir) {
    let files = fs.readdirSync(cacheDir); // 缓存目录下的所有文件
    // [
    //   'development_instance_0_648e06d8ccf6b2a120b0c509e9d9faa3',
    //   'package.json.hash',
    //   'production_instance_0_0e23014f60f8b40abe090dec642ebbf9'
    // ]
    let scripts, styles;
    // 获取缓存文件夹 e.g. development_instance_0_648e06d8ccf6b2a120b0c509e9d9faa3
    let childDir = files.filter(item => item.indexOf((process.env.NODE_ENV||'development')+"_instance") > -1)[0];
    // 拼接route
    cacheDir = path.join(cacheDir, childDir); // 获取完整路径

    if (cacheDir) {
      // get files name
      files = fs.readdirSync(cacheDir);
      scripts = files.filter(item => item.endsWith(".js"));
      styles = files.filter(item => item.endsWith(".css"));
    }

    return { scripts, styles };
  }

  return { scripts: [], styles: [] };
}

class AutoDLLInjectPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    let _this = this;

    compiler.hooks.compilation.tap("AutoDllPlugin", function(compilation) {
      if (!HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration) {
        // if not load HtmlWebpackPlugin return 
        return;
      }

      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        "AutoDllPlugin",
        function(htmlPluginData, callback) {
          // htmlPluginData.assets.js
          // ["/../dist/dll/vendor.320d23.js", "/activity\\index.0aa46b.js"];

          let { scripts, styles } = getAutoDLLFiles();

          if (_this.options.fileMap) {
            scripts = scripts.map(_this.options.fileMap);
            styles = styles.map(_this.options.fileMap);
          }

          htmlPluginData.assets.js = [].concat(
            scripts,
            htmlPluginData.assets.js
          );

          htmlPluginData.assets.css = [].concat(
            styles,
            htmlPluginData.assets.css
          );

          // console.log(htmlPluginData.assets.js);
          callback(null, htmlPluginData);
        }
      );
    });
  }
}

module.exports = AutoDLLInjectPlugin