module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['tests/**/*.test.js'],
    preprocessors: {},
    reporters: ['progress'],
    browsers: ['Chrome'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher'
    ]
  });
};
