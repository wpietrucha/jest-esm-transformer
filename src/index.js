const babel = require("@babel/core");
const path = require("path");
const { fileURLToPath } = require("url");

module.exports = {
    process(src, filename, transformOptions) {
        // Replace import.meta.url with the actual file URL before Babel processes it.
        const fileUrl = `file://${filename.replace(/\\/g, '/')}`;
        src = src.replace(/import\.meta\.url/g, JSON.stringify(fileUrl));

        const options = {
            babelrc: false,
            compact: false,
            plugins: [
                require.resolve("@babel/plugin-transform-modules-commonjs"),
                require.resolve("@babel/plugin-transform-class-static-block")
            ],
            // Ensures that babel respects original source maps. This allows to use
            // already transpiled JavaScript source code and enables correct stack
            // traces when tests fail.
            inputSourceMap: true,

            // To make sure filenames are accurate
            filename: filename,
            cwd: transformOptions.cwd,
        };

        const transformResult = babel.transform(src, options);
        if (transformResult) {
            const { code, map } = transformResult;
            if (typeof code === 'string') {
                return { code, map };
            }
        }

        return src;
    }
};