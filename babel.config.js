module.exports = function(api){
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo",{jsxImportSource: "nativewind"}],
            "nativewind/babel"
        ],
        plugins: [
            'react-native-reanimated/plugin',
            [
                'module-resolver',
                {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
                    alias: {
                        '@': './',
                        'FrontBodySvg': './components/organisms/InteractiveSvg',
                    },
                },
            ],
        ],
    };
}
