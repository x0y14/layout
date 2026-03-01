import { test, expect } from '@playwright/test'

test('my-element の Shadow DOM 内に "I am green!" が表示される', async ({ page }) => {
  await page.goto('/')
  const paragraph = page.locator('my-element').locator('p')
  await expect(paragraph).toHaveText('I am green!')
})
