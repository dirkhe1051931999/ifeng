/* eslint-env node */
module.exports = {
  presets: [
    '@quasar/babel-preset-app',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    [
      'prismjs',
      {
        languages: ['javascript', 'css', 'json'],
        plugins: [],
        theme: 'coy',
        css: true,
      },
    ],
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true,
      },
      'vant',
    ],
  ],
};