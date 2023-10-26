import { expect, test } from '@playwright/test'
let incidentNumber: any

test.describe('Service Now Application Cases', () => {
    test.slow()
    test('TC001 - Login into Service Now Application', async ({ page }) => {
        //To Login into Service Now application
        await page.goto('https://dev189340.service-now.com', { timeout: 50000 })
        await expect(page.locator('#user_name')).toBeVisible()
        await page.locator('#user_name').fill('admin')
        await page.locator('#user_password').fill('Testing@1918')
        await page.locator('#sysverb_login').click()
        await expect(page.locator('div[data-id="header-center"]'), "Verify the user is logged in successfully!").toContainText('ServiceNow', { timeout: 50000 })
        await page.context().storageState({ 'path': 'tests/Week4/files/servicenow_state.json' })
    })

    test.describe('Service Now Incident Related cases', () => {
        test.use({ 'storageState': 'tests/Week4/files/servicenow_state.json' })
        test('TC002 - Create an Incident in Service Now', async ({ page }) => {
            //Search for Incidents Under Service Desk
            page.waitForTimeout(2000)
            page.goto('https://dev189340.service-now.com/now/nav/ui/classic/params/target/ui_page.do')
            await page.locator('div.polaris-header div[aria-label="All"]').click({ timeout: 50000 })
            await expect(page.getByPlaceholder('Filter')).toBeVisible()
            await page.getByPlaceholder('Filter').focus()
            await page.getByPlaceholder('Filter').fill('Incidents')
            page.locator('a[aria-label="Incidents"]').nth(1).click()
            await expect(page.locator('div[data-id="header-center"]'), "Verify the user navigated to Incident Page").toContainText('Incidents', { timeout: 50000 })

            //Create a New Incident
            const incidentFrame = await page.frameLocator('#gsft_main')
            await incidentFrame.locator('#sysverb_new').focus()
            await incidentFrame.locator('#sysverb_new').click()
            await expect(page.locator('div[data-id="header-center"]'), "Verify the user navigated to Incident Page").toContainText('Incident - Create', { timeout: 50000 })
            incidentNumber = await incidentFrame.locator('input[id="incident.number"]').getAttribute("value") as string
            console.log("Incident Number is:", incidentNumber)

            const windowPromise = page.context().waitForEvent("page", { timeout: 50000 })
            await incidentFrame.locator('div[id*="caller_id"] button[id*="lookup"]').click()
            const newWindow = await windowPromise
            await newWindow.bringToFront()
            await newWindow.locator('input[placeholder="Search"][class="form-control"]').fill('Sean Bonnet')
            await newWindow.keyboard.press('Enter')
            await newWindow.getByText('Sean Bonnet').click()
            await page.waitForTimeout(2000)
            await incidentFrame.locator('input[id="incident.short_description"]').fill('Incident1-Short Description')
            await incidentFrame.locator('button#sysverb_insert').click()
            await page.waitForTimeout(5000)
        })

        test('TC003 - Update an Incident in Service Now', async ({ page }) => {
            console.log("Incident Number in the Update Case:", incidentNumber)
            page.goto('https://dev189340.service-now.com/now/nav/ui/classic/params/target/ui_page.do')
            //Search for Incidents Under Service Desk
            page.waitForTimeout(2000)
            await page.locator('div.polaris-header div[aria-label="All"]').click({ timeout: 50000 })
            await expect(page.getByPlaceholder('Filter')).toBeVisible()
            await page.getByPlaceholder('Filter').focus()
            await page.getByPlaceholder('Filter').fill('Incidents')
            page.locator('a[aria-label="Incidents"]').nth(1).click()
            await expect(page.locator('div[data-id="header-center"]'), "Verify the user navigated to Incident Page").toContainText('Incidents', { timeout: 50000 })

            //Search for the Incident Number
            const incidentFrame = await page.frameLocator('#gsft_main')
            await incidentFrame.locator('select[aria-label*="Incidents list"]').selectOption('Number')
            await incidentFrame.locator('div#list_nav_incident input[placeholder="Search"]').fill(incidentNumber)
            await page.keyboard.press('Enter')
            
            await incidentFrame.locator('a.formlink[href*="'+incidentNumber+'"]').click()
            await page.waitForTimeout(7000)
            await incidentFrame.locator('select[id*="state"]').selectOption('In Progress')
            await incidentFrame.locator('select[id*="urgency"]').selectOption('1 - High')
            
            await incidentFrame.locator('textarea[placeholder="Work notes"]').nth(0).fill(incidentNumber + ' : Working Notes')
            await incidentFrame.locator('button#sysverb_update').click()
            await page.waitForTimeout(8000)

            //To Verify the Incident State is updated as In Progress
            expect(incidentFrame.locator('tr[data-list_id="incident"] td').nth(7)).toContainText('In Progress', { timeout: 50000 })
        })

        test('TC004 - Resolve an Incident in Service Now', async ({ page }) => {
            console.log("Incident Number in the Resolve Case:", incidentNumber)
            page.goto('https://dev189340.service-now.com/now/nav/ui/classic/params/target/ui_page.do')
            //Search for Incidents Under Service Desk
            page.waitForTimeout(2000)
            await page.locator('div.polaris-header div[aria-label="All"]').click({ timeout: 50000 })
            await expect(page.getByPlaceholder('Filter')).toBeVisible()
            await page.getByPlaceholder('Filter').focus()
            await page.getByPlaceholder('Filter').fill('Incidents')
            page.locator('a[aria-label="Incidents"]').nth(1).click()
            await expect(page.locator('div[data-id="header-center"]'), "Verify the user navigated to Incident Page").toContainText('Incidents', { timeout: 50000 })

            //Search for the Incident Number
            const incidentFrame = await page.frameLocator('#gsft_main')
            await incidentFrame.locator('select[aria-label*="Incidents list"]').selectOption('Number')
            await incidentFrame.locator('div#list_nav_incident input[placeholder="Search"]').fill(incidentNumber)
            await page.keyboard.press('Enter')
            
            await incidentFrame.locator('a.formlink[href*="'+incidentNumber+'"]').click()
            await page.waitForTimeout(7000)
            await incidentFrame.locator('select[id*="state"]').selectOption('Resolved')

            //Resolution Information
            expect(incidentFrame.locator('span[class="tab_caption_text"]').nth(2)).toContainText('Resolution Information')
            await incidentFrame.locator('span[class="tab_caption_text"]').nth(2).click()
            await incidentFrame.locator('select[id*="close_code"]').selectOption('Workaround provided')
            await incidentFrame.locator('textarea[id*="close_notes"]').fill(incidentNumber + ' : Resolution Notes')
            await incidentFrame.locator('button#resolve_incident').click()
            await page.waitForTimeout(8000)

            //To Verify the Incident State is updated as Resolved
            expect(incidentFrame.locator('tr[data-list_id="incident"] td').nth(7)).toContainText('Resolved', { timeout: 50000 })
        })

        test('TC005 - Delete an Incident in Service Now', async ({ page }) => {
            console.log("Incident Number in the Delete Case:", incidentNumber)
            page.goto('https://dev189340.service-now.com/now/nav/ui/classic/params/target/ui_page.do')
            //Search for Incidents Under Service Desk
            page.waitForTimeout(2000)
            await page.locator('div.polaris-header div[aria-label="All"]').click({ timeout: 50000 })
            await expect(page.getByPlaceholder('Filter')).toBeVisible()
            await page.getByPlaceholder('Filter').focus()
            await page.getByPlaceholder('Filter').fill('Incidents')
            page.locator('a[aria-label="Incidents"]').nth(1).click()
            await expect(page.locator('div[data-id="header-center"]'), "Verify the user navigated to Incident Page").toContainText('Incidents', { timeout: 50000 })

            //Search for the Incident Number
            const incidentFrame = await page.frameLocator('#gsft_main')
            await incidentFrame.locator('select[aria-label*="Incidents list"]').selectOption('Number')
            await incidentFrame.locator('div#list_nav_incident input[placeholder="Search"]').fill(incidentNumber)
            await page.keyboard.press('Enter')
            
            await incidentFrame.locator('a.formlink[href*="'+incidentNumber+'"]').click()
            await page.waitForTimeout(7000)

            //Delete Incident
            await incidentFrame.locator('button#sysverb_delete').click()
            expect(incidentFrame.locator('div.modal-body.container-fluid')).toBeVisible()
            expect(incidentFrame.locator('div.modal-body.container-fluid')).toContainText("Deleting this record will result in the automatic deletion of the following related records:")
            await incidentFrame.locator('button.btn.btn-destructive').click()           
            await page.waitForTimeout(8000)
            
            //To Verify the Incident is Deleted
            expect(incidentFrame.locator('div.list2_empty-state-list')).toBeVisible()
        })
    })
})