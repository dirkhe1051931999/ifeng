module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript/recommended'],

  plugins: ['@typescript-eslint', 'vue', 'prettier'],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true,
  },
  // add your custom rules here
  rules: {
    'prettier/prettier': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    eqeqeq: ['error', 'always'],
    '@typescript-eslint/class-name-casing': 'off',
    // 禁止使用 var
    'no-var': 'error',
    // 没用到的变量warn
    'no-unused-vars': 'warn',
    // 禁止直接调用 Object.prototypes 的内置属性
    'no-prototype-builtins': 'error',
    // 要求回调函数使用箭头函数
    'prefer-arrow-callback': 'error',
    // 要求使用模板字面量而非字符串连接
    'prefer-template': 'error',
    // 禁止修改 const 声明的变量
    'no-const-assign': 'error',
    // 在定义变量前不允许使用变量
    'no-use-before-define': 'error',
    // 不允许无用的return
    'no-useless-return': 'error',
    // 禁止类成员中出现重复的名称
    'no-dupe-class-members': 'error',
    // allow async-await 强制 generator 函数中 * 号周围使用一致的空格
    'generator-star-spacing': 'off',
    'no-unsafe-any': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/no-deprecated-filter': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-this-alias': 'off',
  },
};