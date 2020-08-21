module.exports = function (wallaby) {

    return {
        localProjectDir: "tests",

        files: [
            '/**/*.js',
            '!/**/*.test.js',
            '!/node_modules/**/*.js',
            '!/api/node_modules/**/*.js',
        ],

        tests: [
            '/**/*.test.js',
            '/tests/*.test.js',
            '!/tests/acceptance/**/*.js',
            '!/node_modules/**/*.js',
            '!/api/node_modules/**/*.js',
        ],

        env: { type: 'node' },
        testFramework: 'jest',
    }
};