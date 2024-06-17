module.exports = (api) => {
  api.cache(false);

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
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
