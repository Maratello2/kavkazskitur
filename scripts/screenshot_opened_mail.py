import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(ignore_https_errors=True)
    page.goto('https://mail.kavkazskitur.ru/', wait_until='networkidle')
    time.sleep(2)
    
    if page.locator('input[name="Email"]').count() > 0:
        page.fill('input[name="Email"]', 'info@kavkazskitur.ru')
        page.fill('input[name="Password"]', 'Kavkaz2026!Mail')
        page.click('button:has-text("SIGN IN")')
        time.sleep(3)
        
    page.locator('text=Новая заявка на тур').click()
    time.sleep(2)
    page.screenshot(path='scripts/snappy_lead_opened.png')
    print("Screenshot saved to scripts/snappy_lead_opened.png")
    browser.close()
