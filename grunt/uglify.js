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
  // embedNext: {
  //   options: {
  //     banner: '<%= banner %>'
  //   },
  //   src: ['build/embed/client.next.js'],
  //   dest: 'build/embed/client.next.min.js'
  // },
  dist: {
    options: {
      banner: '<%= banner %>'
    },
    src: ['build/client.js'],
    dest: 'build/client.min.js'
  },
  // next: {
  //   options: {
  //     banner: '<%= banner %>'
  //   },
  //   src: ['build/client.next.js'],
  //   dest: 'build/client.next.min.js'
  // }
};
