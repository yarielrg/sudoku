module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            '**/*.spec.ts'
        ],
        preprocessors: {
            '**/*.spec.ts': ['webpack']
        },
        reporters: ['progress'],
        browsers: ['Chrome'],
        singleRun: true,
        webpack: {
            // webpack configuration
        }
    });
};