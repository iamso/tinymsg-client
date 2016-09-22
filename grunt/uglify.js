module.exports = {
  options: {
    mangle: {
      except: ['u', 'µ']
    },
    compress: {
      drop_console: true
    },
    preserveComments: false,
    sourceMap: false
  },
  embed: {
    options: {
      banner: '<%= banner %>'
    },
    src: ['build/embed/client.js'],
    dest: 'build/embed/client.min.js'
  },
  // embedBabel: {
  //   options: {
  //     banner: '<%= banner %>'
  //   },
  //   src: ['build/embed/client.babel.js'],
  //   dest: 'build/embed/client.babel.min.js'
  // },
  dist: {
    options: {
      banner: '<%= banner %>'
    },
    src: ['build/client.js'],
    dest: 'build/client.min.js'
  },
  // babel: {
  //   options: {
  //     banner: '<%= banner %>'
  //   },
  //   src: ['build/client.babel.js'],
  //   dest: 'build/client.babel.min.js'
  // }
};
