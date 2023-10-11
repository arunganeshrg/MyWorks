import {test} from "@playwright/test"

test('Week2 Day2 Test', async({page})=>{
    await page.goto('https://login.salesforce.com/')
    await page.locator('input#username').fill('arung@testleaf.com')
    await page.locator('input#password').fill('Testing@1918')
    await page.locator('input#Login').click({force:true})

    await page.waitForTimeout(5000)

    await page.locator('button[class$="salesforceIdentityAppLauncherHeader"]').click()

    await page.waitForTimeout(3000)

    await page.locator('input[placeholder^="Search apps and items"]').fill('Sales')

})