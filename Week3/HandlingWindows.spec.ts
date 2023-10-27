import { expect, test } from '@playwright/test'


test.only(`Window Handling`, async ({ page, context }) => {

    await page.goto('https://www.leafground.com/window.xhtml')

    const windowPromise = context.waitForEvent('page')
    const btnSection = page.locator('div.card').filter({ 'hasText': 'Click and Confirm new Window Opens' })
    await btnSection.locator('button').filter({ 'hasText': 'Open' }).click()
    const promise = await windowPromise
    await promise.bringToFront()
    expect(await promise.url(), 'Verify the Page URL').toContain('dashboard')
    await page.bringToFront()
    expect(await page.url(), 'Verify the Page URL').toContain('window')
})