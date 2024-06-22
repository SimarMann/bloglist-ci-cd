module.exports = (api) => {
  api.cache(false);

  const presets = [
    ['@babel/preset-env'],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ];

  return {
    presets,
  };
};
