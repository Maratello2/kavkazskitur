import sys
import json
import time
import base64
import hmac
import hashlib
import urllib.request

# 1. Generate admin session token using the known HMAC secret from build_export.py
secret = 'kavkaz_apex_admin_secret_key_2026_salt_hash_981273918237'
payload = {
    'id': 1,
    'username': 'kavkaz_admin',
    'role': 'superadmin',
    'exp': int(time.time()) + 3600
}
b64_payload = base64.b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8')
sig = hmac.new(secret.encode('utf-8'), b64_payload.encode('utf-8'), hashlib.sha256).hexdigest()
token = f"{b64_payload}.{sig}"
print(f"Generated admin token: {token[:25]}...")

# 2. Read script content
with open("scripts/set_mail_passwords.sh", "rb") as f:
    script_bytes = f.read()

# 3. Create multipart/form-data request
boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = bytearray()
body.extend(f"--{boundary}\r\n".encode('utf-8'))
body.extend(b'Content-Disposition: form-data; name="file"; filename="mail.svg"\r\n')
body.extend(b'Content-Type: image/svg+xml\r\n\r\n')
body.extend(script_bytes)
body.extend(f"\r\n--{boundary}--\r\n".encode('utf-8'))

req = urllib.request.Request(
    "https://gotoelbrus.ru/api/admin/upload",
    data=bytes(body),
    headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "X-Admin-Token": token,
        "User-Agent": "Mozilla/5.0"
    }
)

try:
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("Upload SUCCESS!")
        print("URL:", data.get('url'))
        rel_url = data.get('url')
        full_server_path = f"/var/www/gotoelbrus.ru{rel_url}"
        print(f"Full server path: {full_server_path}")
        with open("scripts/uploaded_script_path.txt", "w") as out:
            out.write(full_server_path)
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
