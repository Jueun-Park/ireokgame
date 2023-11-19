import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter(),
		paths: { base: process.argv.includes('dev') ? '' : process.env.BASE_PATH }
	}
};

export default config;