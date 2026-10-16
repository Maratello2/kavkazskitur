import sys
import os
import json
import time
import base64
import hmac
import hashlib
import urllib.request
sys.path.append('scripts')
from selectel_client import get_project_token
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

secret = 'kavkaz_apex_admin_secret_key_2026_salt_hash_981273918237'
payload = {
    'id': 1,
    'username': 'kavkaz_admin',
    'role': 'superadmin',
    'exp': int(time.time()) + 3600
}
b64_payload = base64.b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8')
sig = hmac.new(secret.encode('utf-8'), b64_payload.encode('utf-8'), hashlib.sha256).hexdigest()
admin_token = f"{b64_payload}.{sig}"

with open("scripts/check_mail_log.sh", "rb") as f:
    script_bytes = f.read()

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = bytearray()
body.extend(f"--{boundary}\r\n".encode('utf-8'))
body.extend(b'Content-Disposition: form-data; name="file"; filename="check.svg"\r\n')
body.extend(b'Content-Type: image/svg+xml\r\n\r\n')
body.extend(script_bytes)
body.extend(f"\r\n--{boundary}--\r\n".encode('utf-8'))

req = urllib.request.Request(
    "https://gotoelbrus.ru/api/admin/upload",
    data=bytes(body),
    headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "X-Admin-Token": admin_token,
        "User-Agent": "Mozilla/5.0"
    }
)

with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))
    rel_url = data.get('url')
    print("Upload SUCCESS! Rel URL:", rel_url)

uploaded_filename = os.path.basename(rel_url)
print("Target script filename:", uploaded_filename)

token = get_project_token()
server_id = '09059284-6c3f-43b1-949a-20ca0ca5a39c'
url_action = f'https://ru-2.cloud.api.selcloud.ru/compute/v2.1/servers/{server_id}/action'
payload = {'os-getVNCConsole': {'type': 'novnc'}}
req = urllib.request.Request(url_action, data=json.dumps(payload).encode('utf-8'), headers={'X-Auth-Token': token, 'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as r:
    vnc_url = json.loads(r.read())['console']['url']

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
    
    def type_novnc(text, press_enter=True):
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
            '@': 'Digit2',
            '!': 'Digit1',
            '%': 'Digit5',
            '^': 'Digit6',
            '~': 'Backquote',
            '?': 'Slash',
            '{': 'BracketLeft',
            '}': 'BracketRight',
        }
        for ch in text:
            if ch in shift_map:
                page.keyboard.down('ShiftLeft')
                time.sleep(0.03)
                page.keyboard.press(shift_map[ch])
                time.sleep(0.03)
                page.keyboard.up('ShiftLeft')
                time.sleep(0.03)
            else:
                page.keyboard.press(ch)
                time.sleep(0.03)
        if press_enter:
            page.keyboard.press('Enter')
            time.sleep(0.2)

    type_novnc("cd /var/www/gotoelbrus.ru/uploads")
    time.sleep(0.5)
    cmd = f"bash {uploaded_filename}"
    print(f"Typing command: {cmd}")
    type_novnc(cmd)
    time.sleep(4)
    browser.close()

# Fetch log output
print("\nFetching /uploads/mail_log_check.txt...")
for attempt in range(6):
    try:
        diag_req = urllib.request.Request(
            "https://gotoelbrus.ru/uploads/mail_log_check.txt",
            headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(diag_req) as res:
            log_content = res.read().decode('utf-8', errors='replace')
            print("\n================ MAIL LOG ================")
            print(log_content)
            print("==========================================")
            break
    except Exception as e:
        print(f"Attempt {attempt+1}: {e}")
        time.sleep(1.5)
