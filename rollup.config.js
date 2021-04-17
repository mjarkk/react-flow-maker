import stylus from 'rollup-plugin-stylus-compiler';
import css from 'rollup-plugin-css-porter';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.BUILD === 'production';

const plugins = [
  stylus(),
  css({ minified: true }),
  babel({
    babelHelpers: 'bundled',
  }),
  isProduction ? terser() : undefined,
];

export default {
  input: 'flowmaker.js',
  plugins,
  external: [
    'react',
    'js-sha1',
  ],
  output: [
    {
      file: 'dist/flowmaker.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/flowmaker.umd.js',
      format: 'umd',
      sourcemap: true,
      name: 'flowmaker',
      globals: {
        react: 'React',
        'js-sha1': 'sha1',
      }
    },
    {
      file: 'dist/flowmaker.es.js',
      format: 'es',
      sourcemap: true,
    },
  ],
}
