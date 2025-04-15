
import { test, expect } from '@playwright/test';

test('Library function works', async ({ page }) => {
    const consoleMessages: string[] = [];
  
    // Capture console logs
    page.on('console', (msg) => {
        console.log(msg.text());
        consoleMessages.push(msg.text());
    });
    await page.goto('http://localhost:3000/test/e2e/index.html');
    await expect(page.locator('h1')).toHaveText( "prefetchjs Library end to end test page");
    // Wait for any async logs to appear
    await page.waitForTimeout(100); 

    const globalValue = await page.evaluate(() => window.fetched_content);
    expect(globalValue).toEqual("a.txt content");
});
