import time
import json
import urllib.request
import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# 1. Post lead to gotoelbrus.ru/api/leads
print("--- 1. Submitting lead to https://gotoelbrus.ru/api/leads ---")
lead_payload = {
    "clientName": "Test Lead Discovery",
    "clientPhone": "+7 928 999-88-77",
    "clientEmail": "discovery@kavkazskitur.ru",
    "tourTitle": "Восхождение на Эльбрус с юга (Классика)",
    "preferredDate": "Июль 2026",
    "comment": "Тестовая заявка для проверки входящей корпоративной почты.",
    "consent_152fz": True,
    "website_hp": ""
}

req = urllib.request.Request(
    "https://gotoelbrus.ru/api/leads",
    data=json.dumps(lead_payload).encode('utf-8'),
    headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
)

try:
    with urllib.request.urlopen(req) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
        print("Lead submission response:", res_data)
except Exception as e:
    print("Error submitting lead:", e)

print("Waiting 5 seconds for local LMTP delivery...")
time.sleep(5)

# 2. Check SnappyMail inbox for info@kavkazskitur.ru
print("\n--- 2. Checking SnappyMail inbox ---")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(ignore_https_errors=True)
    page.goto('https://mail.kavkazskitur.ru/', wait_until='networkidle')
    time.sleep(2)
    
    # Check if already logged in or needs login
    if page.locator('input[name="Email"]').count() > 0:
        page.fill('input[name="Email"]', 'info@kavkazskitur.ru')
        page.fill('input[name="Password"]', 'Kavkaz2026!Mail')
        page.click('button:has-text("SIGN IN")')
        time.sleep(5)
    
    # If "Edit Identity" modal pops up, click Save or Close
    if page.locator('button:has-text("Save")').count() > 0:
        print("Dismissing Edit Identity modal...")
        page.click('button:has-text("Save")')
        time.sleep(2)
        
    page.screenshot(path='scripts/snappy_inbox_view.png')
    print("Screenshot saved to scripts/snappy_inbox_view.png")
    
    # Extract message list items
    messages = page.locator('.message-list-item, .item, .mail-item').all()
    print(f"Found {len(messages)} message items in DOM.")
    
    text_content = page.locator('body').inner_text()
    if "Новая заявка" in text_content or "Эльбрус" in text_content:
        print("CONFIRMED: Lead notification email found in SnappyMail!")
    else:
        print("Lead text not immediately visible in text content, check screenshot.")
        
    browser.close()
