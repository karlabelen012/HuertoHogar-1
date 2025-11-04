const webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
  config.set({
    // Carpeta base
    basePath: '',

    // Framework de pruebas
    frameworks: ['jasmine'],

    // Archivos de test que se van a ejecutar
    files: [
      'src/**/*.test.js',
      'src/**/*.test.jsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx'
    ],

    // Qué archivos pasan por webpack antes de correr
    preprocessors: {
      'src/**/*.test.js': ['webpack'],
      'src/**/*.test.jsx': ['webpack'],
      'src/**/*.test.ts': ['webpack'],
      'src/**/*.test.tsx': ['webpack']
    },

    // Configuración de webpack reutilizando tu webpack.config.js
    webpack: {
      ...webpackConfig,
      mode: 'development',
      resolve: {
        ...webpackConfig.resolve,
        alias: {
          ...(webpackConfig.resolve ? webpackConfig.resolve.alias : {})
        }
      }
    },

    // Navegador que usará Karma
    browsers: ['Chrome'],
    // Reporte en consola
    reporters: ['progress'],


    // Log y comportamiento
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun:process.env.config === 'true',      // si lo quieres que corra una sola vez, pon true
    concurrency: Infinity,

    // Plugins que usa Karma
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-webpack'
    ]
  });
};
