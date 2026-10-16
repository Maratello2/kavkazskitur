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
    
    # 1. Download mail.sh using wget
    cmd_wget = "wget -q -O /tmp/mail.sh https://raw.githubusercontent.com/Maratello2/kavkazskitur/main/scripts/mail.sh"
    print(f"Running in VNC: {cmd_wget}")
    page.keyboard.type(cmd_wget, delay=25)
    page.keyboard.press('Enter')
    time.sleep(3)
    
    # 2. Execute mail.sh
    cmd_run = "bash /tmp/mail.sh"
    print(f"Running in VNC: {cmd_run}")
    page.keyboard.type(cmd_run, delay=25)
    page.keyboard.press('Enter')
    
    # Wait and capture progress
    for i in range(24): # 24 * 5s = 120s
        time.sleep(5)
        page.screenshot(path='scripts/vnc_deploy_progress.png')
        print(f"Deployment in progress... ({i*5+5}s)")
        
    page.screenshot(path='scripts/vnc_deploy_done.png')
    print("Deployment finished, screenshot saved to scripts/vnc_deploy_done.png")
    browser.close()
