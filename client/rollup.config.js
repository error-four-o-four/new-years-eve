
import { minify } from 'rollup-plugin-esbuild-minify';
import copy from 'rollup-plugin-copy'
import css from "rollup-plugin-import-css";

export default {
	input: './src/main.js',
	output: {
		file: './build/bundle.min.js',
		format: 'es',
		name: 'bundle'
	},
	plugins: [
		copy({
      targets: [
        { src: 'src/assets/glsl/*', dest: 'build/assets/glsl' },
        { src: 'src/assets/sounds/*', dest: 'build/assets/sounds' },
      ]
    }),
		css({
			minify: true
		}),
		minify(),
	]
};