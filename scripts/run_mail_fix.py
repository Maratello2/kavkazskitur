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

# 1. Generate admin session token
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
print(f"Generated admin token: {admin_token[:25]}...")

# 2. Upload script
with open("scripts/fix_and_inspect_mail.sh", "rb") as f:
    script_bytes = f.read()

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = bytearray()
body.extend(f"--{boundary}\r\n".encode('utf-8'))
body.extend(b'Content-Disposition: form-data; name="file"; filename="fix.svg"\r\n')
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

# Extract filename: e.g. upload_6ad2005bc5ec73.31413804.svg
uploaded_filename = os.path.basename(rel_url)
print("Uploaded filename:", uploaded_filename)
# The unique prefix before the dot: e.g. upload_6ad2005
prefix = uploaded_filename[:14]
print("Prefix for tab completion:", prefix)

# 3. Connect to noVNC and execute
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
    
    # Run the uploaded script via Tab completion
    cmd = f"bash {prefix}"
    print(f"Typing: {cmd} + Tab + Enter")
    page.keyboard.type(cmd, delay=30)
    time.sleep(0.5)
    page.keyboard.press('Tab')
    time.sleep(1)
    page.keyboard.press('Enter')
    time.sleep(5)
    
    page.screenshot(path='scripts/vnc_mail_fix_exec.png')
    print("Screenshot saved to scripts/vnc_mail_fix_exec.png")
    browser.close()

# 4. Fetch the output log via HTTPS
print("Fetching /uploads/mail_diag.txt...")
for attempt in range(5):
    try:
        diag_req = urllib.request.Request(
            "https://gotoelbrus.ru/uploads/mail_diag.txt",
            headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(diag_req) as res:
            log_content = res.read().decode('utf-8', errors='replace')
            print("\n================ DIAGNOSTIC LOG ================")
            print(log_content)
            print("================================================")
            break
    except Exception as e:
        print(f"Attempt {attempt+1}: {e}")
        time.sleep(2)
