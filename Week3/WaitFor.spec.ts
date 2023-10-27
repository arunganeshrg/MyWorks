import { expect, test } from '@playwright/test'

test(`Test Wait For`, async ({ page }) => {
    await page.goto('https://www.leafground.com/waits.xhtml')
    await page.waitForTimeout(5000)
    const btnSection = page.locator('div.card').filter({ 'hasText': 'Wait for Visibility (1 - 10 Sec)' })
    await expect(btnSection.locator('button').filter({ 'hasText': 'I am here' })).not.toBeAttached
    await btnSection.locator('button').filter({ 'hasText': 'Click' }).click()
    await btnSection.locator('button').filter({ 'hasText': 'I am here' }).waitFor({ 'state': 'visible', 'timeout': 15000 })
    await expect(btnSection.locator('button').filter({ 'hasText': 'I am here' })).toBeAttached
})