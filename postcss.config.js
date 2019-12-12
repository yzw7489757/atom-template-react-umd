module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-url': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    },
    cssnano: {
      'cssnano-preset-advanced': {
        zindex: false,
        autoprefixer: false,
        'postcss-zindex': false,
      },
    },
    // 'postcss-cssnext': {}, // cssnext。该插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理
    'postcss-px-to-viewport': {
      viewportWidth: 750, // (Number) 视区的宽度。
      viewportHeight: 1334, // (Number)视区的高度。
      unitPrecision: 3, // (Number) 允许REM单位增长到的十进制数。
      viewportUnit: 'vw', // (String) 预期单位.
      selectorBlackList: [], // (Array) 要忽略并保留为px的选择器.
      minPixelValue: 1, // (Number) 设置要替换的最小像素值.
      mediaQuery: false, // (Boolean) 允许在媒体查询中转换px。
      exclude: [/node_modules/],
    },
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': { utf8: false },
  },
};
