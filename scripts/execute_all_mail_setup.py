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
    
    def type_novnc(text):
        shift_map = {
            '(': 'Digit9',
            ')': 'Digit0',
            '_': 'Minus',
            '+': 'Equal',
            ':': 'Semicolon',
            '"': 'Quote',
            '>': 'Period',
            '<': 'Comma',
            '|': 'Backslash',
            '*': 'Digit8',
            '&': 'Digit7',
            '$': 'Digit4',
            '!': 'Digit1',
            '{': 'BracketLeft',
            '}': 'BracketRight'
        }
        for ch in text:
            if ch in shift_map:
                page.keyboard.down('ShiftLeft')
                time.sleep(0.02)
                page.keyboard.press(shift_map[ch])
                time.sleep(0.02)
                page.keyboard.up('ShiftLeft')
                time.sleep(0.02)
            else:
                page.keyboard.press(ch)
                time.sleep(0.02)
        page.keyboard.press('Enter')

    commands = [
        # 1. Update password hashes in Dovecot
        "H=$(doveadm pw -s SHA512-CRYPT -p 'Kavkaz2026!Mail')",
        'echo "info@kavkazskitur.ru:$H" > /etc/dovecot/users',
        'echo "info@kavkazskitur.com:$H" >> /etc/dovecot/users',
        "chmod 640 /etc/dovecot/users",
        "chown root:dovecot /etc/dovecot/users",
        "systemctl restart dovecot",
        
        # 2. Configure SnappyMail domains
        "bash /var/www/gotoelbrus.ru/uploads/upload_6ad1fd3a2b2634.01519767.svg",
        
        # 3. Echo done
        "echo '=== ALL_MAIL_SETUP_DONE ==='"
    ]

    for cmd in commands:
        print(f"Executing: {cmd}")
        type_novnc(cmd)
        time.sleep(1.5)
        
    time.sleep(3)
    page.screenshot(path='scripts/vnc_all_mail_done.png')
    print("Screenshot saved to scripts/vnc_all_mail_done.png")
    browser.close()
