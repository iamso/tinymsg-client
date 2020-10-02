import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import {terser} from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const comment         = `/*!
 * ${pkg.name} - version ${pkg.version}
 *
 * Made with ❤ by ${pkg.author.name} ${pkg.author.email}
 *
 * Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name}
 */
`;

const browserEmbed = (() => {
  const split = pkg.browser.split('/');
  split.splice(1, 0, 'embed');
  return split.join('/');
})();

const mainEmbed = (() => {
  const split = pkg.main.split('/');
  split.splice(1, 0, 'embed');
  return split.join('/');
})();

const moduleEmbed = (() => {
  const split = pkg.module.split('/');
  split.splice(1, 0, 'embed');
  return split.join('/');
})();


export default [
	// browser-friendly UMD build
	{
		input: 'src/client.js',
		output: {
			name: 'Msg',
			file: browserEmbed,
      format: 'umd',
      banner: comment,
		},
		plugins: [
      // resolve(),
      // commonjs(),
			babel({
        presets: [
          ["@babel/preset-env", {
            targets: {
              browsers: ["last 2 versions", "not IE < 11", "not IE_mob < 11"]
            },
          modules: false
          }]
        ],
        plugins: [
          "@babel/plugin-proposal-function-bind"
        ],
				exclude: ['node_modules/**']
      }),
      cleanup(),
      terser(),
		]
  },
  {
		input: 'src/client.js',
		output: {
			name: 'Msg',
			file: pkg.browser,
      format: 'umd',
      banner: comment,
		},
		plugins: [
      // resolve(),
      // commonjs(),
			babel({
        presets: [
          ["@babel/preset-env", {
            targets: {
              browsers: ["last 2 versions", "not IE < 11", "not IE_mob < 11"]
            },
          modules: false
          }]
        ],
        plugins: [
          "@babel/plugin-proposal-function-bind"
        ],
				exclude: ['node_modules/**']
      }),
      cleanup(),
      replace({
        '<%=url%>': '',
        delimiters: ['', '']
      }),
      terser(),
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/client.js',
		output: [
			{
        file: mainEmbed,
        format: 'cjs',
        banner: comment,
        exports: 'auto',
      },
			{
        file: moduleEmbed,
        format: 'es',
        banner: comment,
      }
		],
		plugins: [
      babel({
        presets: [
          ["@babel/preset-env", {
            targets: {
              browsers: ["last 2 versions", "not IE <= 11", "not IE_mob <= 11"]
            },
          modules: false
          }]
        ],
        plugins: [
          "@babel/plugin-proposal-function-bind"
        ],
        exclude: ['node_modules/**']
			}),
      cleanup(),
      terser(),
		]
  },
  {
		input: 'src/client.js',
		output: [
			{
        file: pkg.main,
        format: 'cjs',
        banner: comment,
        exports: 'auto',
      },
			{
        file: pkg.module,
        format: 'es',
        banner: comment,
      }
		],
		plugins: [
      babel({
        presets: [
          ["@babel/preset-env", {
            targets: {
              browsers: ["last 2 versions", "not IE <= 11", "not IE_mob <= 11"]
            },
          modules: false
          }]
        ],
        plugins: [
          "@babel/plugin-proposal-function-bind"
        ],
        exclude: ['node_modules/**']
			}),
      cleanup(),
      replace({
        '<%=url%>': '',
        delimiters: ['', '']
      }),
      terser(),
		]
	}
];
