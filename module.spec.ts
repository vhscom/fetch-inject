import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Bootstrap 4', () => {
	test('should initially hide page content', async ({ page }) => {
		await expect(page.locator('body')).toBeHidden();
	});

	test('should eventually display page content', async ({ page }) => {
		await expect(page.locator('body')).toBeVisible();
	});

	test('should style alert messages', async ({ page }) => {
		const alert = page.locator('.alert-primary').first();
		const initialColor = await alert.evaluate((el) => {
			return getComputedStyle(el).backgroundColor;
		});
		await page.waitForResponse(
			'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css'
		);
		const styledColor = await alert.evaluate((el) => getComputedStyle(el).backgroundColor);
		expect(styledColor !== initialColor);
	});

	test.describe('Modal', () => {
		test('should have one hidden modal', async ({ page }) => {
			const modal = page.locator('[role="dialog"]');
			const isHidden = await modal.getAttribute('aria-hidden');
			expect((await modal.count()).valueOf() === 1);
			expect(isHidden.valueOf() === 'true');
		});

		test('should have button to launch modal', async ({ page }) => {
			const button = page.locator('text=Launch demo modal');
			expect(button).toBeDefined();
		});

		test('should launch modal on button click', async ({ page }) => {
			const modal = page.locator('[role="dialog"]');
			const isHidden = await modal.getAttribute('aria-hidden');
			const button = page.locator('text=Launch demo modal');
			await button.click();
			expect(isHidden.valueOf() === 'false');
		});
	});
});
