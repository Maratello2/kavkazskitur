import time
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(ignore_https_errors=True)
    page.goto('https://mail.kavkazskitur.ru/', wait_until='networkidle')
    time.sleep(2)
    
    page.fill('input[name="Email"]', 'info@kavkazskitur.ru')
    page.fill('input[name="Password"]', 'Kavkaz2026!Mail')
    page.click('button:has-text("SIGN IN")')
    
    time.sleep(10)
    page.screenshot(path='scripts/snappy_login_result.png')
    
    # Check notifications or errors
    notifs = page.locator('.notification, .alert, .badge, .ui-notification, .v-notification').all()
    for n in notifs:
        print("Notification:", n.inner_text())
    print("Page URL:", page.url)
    browser.close()
