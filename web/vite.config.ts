import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// For further build env configs and troubleshooting
// checkout our official docs [here](https://onboard.blocknative.com/docs/modules/core#sveltekit-vite)

const MODE = process.env.NODE_ENV;
const development = MODE === 'development';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
