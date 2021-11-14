module.exports = function(api) {
  api.cache(true);
  const ignore = [
      "**/__tests__", // ignore the whole test directory
      /\.test\.(jsx|js|ts|tsx)?$/, // ignore test files
  ];
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: 'auto',
        targets: {
          browsers: ['defaults']
        },
        useBuiltIns: 'entry',
        corejs: "3.0.0",
      }
    ],
    '@babel/react',
    '@babel/preset-flow'
  ];
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/transform-runtime',
    'add-module-exports',
    'babel-plugin-dynamic-import-node',
    ["@babel/plugin-transform-typescript", { isTSX: true}], 
    "@babel/plugin-transform-flow-strip-types"
  ];

  return {
    presets,
    plugins,
    ignore
  };
};