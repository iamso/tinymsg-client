module.exports = {
  build: {
    src: ['build/*.js'],             // source files array (supports minimatch)
    dest: 'build/',
    replacements: [{
      from: /<%=url%>/g,                   // string replacement
      to: ''
    }]
  }
};
