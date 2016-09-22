module.exports = {
  "default": [
    "src",
    "watch"
  ],
  "src": [
    // "jshint",
    "concat",
    "replace",
    "notify:src"
  ],
  "dist": [
    // "jshint",
    "clean",
    "concat",
    // "babel",
    "uglify",
    "replace",
    "update_json",
    "notify:dist"
  ]
};
