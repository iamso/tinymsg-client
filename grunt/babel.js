module.exports = {
  options: {
    // sourceMap: true,
    presets: ['babel-preset-es2015']
  },
  dist: {
    files: {
      'build/client.babel.js': 'build/client.next.js',
      'build/embed/client.babel.js': 'build/embed/client.next.js',
    }
  }
};
