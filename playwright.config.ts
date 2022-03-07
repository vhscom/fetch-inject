import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'miniserve --index test-harness.html',
		port: 8080
	}
};

export default config;
