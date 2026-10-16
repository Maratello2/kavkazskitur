import sys
import time
import json
import urllib.request
sys.path.append('scripts')
from selectel_client import get_project_token
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

token = get_project_token()
server_id = '09059284-6c3f-43b1-949a-20ca0ca5a39c'
url_action = f'https://ru-2.cloud.api.selcloud.ru/compute/v2.1/servers/{server_id}/action'
payload = {'os-getVNCConsole': {'type': 'novnc'}}
req = urllib.request.Request(url_action, data=json.dumps(payload).encode('utf-8'), headers={'X-Auth-Token': token, 'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as r:
    vnc_url = json.loads(r.read())['console']['url']

print(f"Connecting to VNC: {vnc_url}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(vnc_url, wait_until='networkidle')
    time.sleep(3)
    
    canvas = page.locator('canvas')
    canvas.click()
    time.sleep(0.5)
    page.keyboard.press('Enter')
    time.sleep(0.5)
    page.keyboard.press('Control+c')
    time.sleep(0.5)
    
    page.keyboard.type("cd /var/www/gotoelbrus.ru/uploads", delay=30)
    page.keyboard.press('Enter')
    time.sleep(1)
    
    # Run upload_6ad2005bc5ec73.31413804.svg using Tab
    page.keyboard.type("bash upload_6ad2005", delay=30)
    time.sleep(0.5)
    page.keyboard.press('Tab')
    time.sleep(1)
    page.keyboard.press('Enter')
    time.sleep(3)
    
    page.screenshot(path='scripts/vnc_passwords_done.png')
    print("Screenshot saved to scripts/vnc_passwords_done.png")
    browser.close()
