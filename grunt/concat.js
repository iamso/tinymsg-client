module.exports = {
  options: {
    separator: '\n\n',
    stripBanners: {
      block: false,
      line: false
    },
    banner: '<%= banner %>',
  },
  embed: {
    src: [
      'src/client.js'
    ],
    dest: 'build/embed/client.js'
  },
  embedNext: {
    src: [
      'src/client.next.js'
    ],
    dest: 'build/embed/client.next.js'
  },
  dist: {
    src: [
      'src/client.js'
    ],
    dest: 'build/client.js'
  },
  next: {
    src: [
      'src/client.next.js'
    ],
    dest: 'build/client.next.js'
  }
};
