/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */
// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { configure } = require('quasar/wrappers');
const path = require('path');
const settings = require('./src/settings.json');
module.exports = configure((ctx) => {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: true,
    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: ['main', 'i18n'],
    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ['index.scss'],
    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: ['material-icons'],
    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'
      transpile: false,
      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      transpileDependencies: [],
      rtl: false, // https://quasar.dev/options/rtl-support
      preloadChunks: true,
      showProgress: false,
      gzip: true,
      analyze: false,
      // Options below are automatically set depending on the env, set them if you want to override
      extractCSS: false,
      distDir: ctx.modeName === 'spa' ? 'dist' : `dist/${ctx.modeName}`,
      // html里面可以获取到的变量
      env: {
        ip: ctx.dev ? `http://${settings.proxy_ip}:${settings.proxy_ip_port}` : `http://${settings.proxy_ip}:${settings.proxy_ip_port}`,
      },
      // https://quasar.dev/quasar-cli/handling-webpack
      extendWebpack(cfg) {
        // linting is slow in TS projects, we execute it only for production builds
        if (ctx.prod) {
          cfg.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /node_modules/,
          });
        }
        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias
          // Add you own alias like this
          '@': path.resolve(__dirname, 'src'),
        };
      },
    },
    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 9102,
      open: true, // opens browser window automatically
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/nine_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}`,
          changeOrigin: true,
          pathRewrite: {
            '^/nine_ifeng': '',
          },
        },
        '/config_nine_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/config`,
          changeOrigin: true,
          pathRewrite: {
            '^/config_nine_ifeng': '',
          },
        },
        '/uc_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/uc`,
          changeOrigin: true,
          pathRewrite: {
            '^/uc_ifeng': '',
          },
        },
        '/api_iclient_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/api_iclient`,
          changeOrigin: true,
          pathRewrite: {
            '^/api_iclient_ifeng': '',
          },
        },
        '/shankapi_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/shankapi`,
          changeOrigin: true,
          pathRewrite: {
            '^/shankapi_ifeng': '',
          },
        },
        '/comment_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/comment_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/comment_ifeng': '',
          },
        },
        '/ximalaya_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/ximalaya_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/ximalaya_ifeng': '',
          },
        },
        '/xiaoshuo_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/xiaoshuo_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/xiaoshuo_ifeng': '',
          },
        },
        '/user_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/user_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/user_ifeng': '',
          },
        },
        '/id_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/id_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/id_ifeng': '',
          },
        },
        '/group_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/group_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/group_ifeng': '',
          },
        },
        '/external_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/external_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/external_ifeng': '',
          },
        },
        '/commoncomment_ifeng': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/commoncomment_ifeng`,
          changeOrigin: true,
          pathRewrite: {
            '^/commoncomment_ifeng': '',
          },
        },
        '/default': {
          target: `http://${settings.proxy_ip}:${settings.proxy_ip_port}/`,
          changeOrigin: true,
          pathRewrite: {
            '^/default': '',
          },
        },
      },
    },
    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'zh-hans', // Quasar language pack
      config: {
        brand: {
          negative: '#e93030',
          primary: '#f54343',
          black: '#252631',
        },
        loadingBar: {
          color: 'primary',
          size: '0px',
          position: 'top',
        },
      },
      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',
      plugins: ['BottomSheet', 'Loading', 'Dialog'],
      components: [],
      directives: ['Ripple', 'Mutation', 'Scroll'],
    },
    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],
    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
    },
    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'quasar admin with typescript ',
        short_name: 'quasar admin with typescript ',
        description: 'quasar admin',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#0080ff',
        icons: [],
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },
    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },
    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        appId: 'quasar.typescript.admin.template',
      },
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,
      extendWebpack(/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },
    },
  };
});