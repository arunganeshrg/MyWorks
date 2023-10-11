import {chromium, test} from "@playwright/test"
import { Console } from "console"

test('Week2 Day1 Test', async()=>{
    const myBrowser = await chromium.launch({headless:false})
    const myBrowserContext1 = await myBrowser.newContext()
    const myBrowserContext2 = await myBrowser.newContext()

    const myPage1 = await myBrowserContext1.newPage()
    const myPage2 = await myBrowserContext2.newPage()

    await myPage1.goto("https://google.com")
    await myPage1.waitForTimeout(5000)
    console.log("Page1 URL is", myPage1.url())

    await myPage2.goto("https://testleaf.com")
    await myPage2.waitForTimeout(5000)
    console.log("Page2 URL is", myPage2.url())
})