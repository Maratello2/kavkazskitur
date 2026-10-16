import json
import urllib.request
import urllib.error

# Authenticate with Selectel
auth_url = "https://cloud.api.selcloud.ru/identity/v3/auth/tokens"
payload = {
    "auth": {
        "identity": {
            "methods": ["password"],
            "password": {
                "user": {
                    "name": "Gemini",
                    "domain": {"name": "705833"},
                    "password": "FaA'83eVOOyC4LWq%}Wd"
                }
            }
        },
        "scope": {
            "project": {
                "id": "a24677210a304aee8d2a9db33282cc65"
            }
        }
    }
}
req = urllib.request.Request(
    auth_url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json", "User-Agent": "domains-go-v2"}
)
with urllib.request.urlopen(req, timeout=10) as res:
    token = res.headers.get("X-Subject-Token")
print("Token obtained:", token[:20])

# Try GET /domains/v1/ptr
ptr_url = "https://api.selectel.ru/domains/v1/ptr"
req = urllib.request.Request(ptr_url, headers={"X-Token": token, "X-Auth-Token": token})
try:
    with urllib.request.urlopen(req) as res:
        print("PTR v1 GET Status:", res.getcode())
        print("PTR v1 GET Body:", res.read().decode())
except urllib.error.HTTPError as e:
    print(f"PTR v1 GET HTTP {e.code}: {e.read().decode()}")
except Exception as e:
    print("PTR v1 GET error:", e)

# Also test POST to create PTR for 161.104.35.24
post_payload = {
    "ip": "161.104.35.24",
    "domain": "mail.kavkazskitur.ru."
}
post_req = urllib.request.Request(
    ptr_url,
    data=json.dumps(post_payload).encode('utf-8'),
    headers={"X-Token": token, "X-Auth-Token": token, "Content-Type": "application/json"},
    method="POST"
)
try:
    with urllib.request.urlopen(post_req) as res:
        print("PTR v1 POST Status:", res.getcode())
        print("PTR v1 POST Body:", res.read().decode())
except urllib.error.HTTPError as e:
    print(f"PTR v1 POST HTTP {e.code}: {e.read().decode()}")
except Exception as e:
    print("PTR v1 POST error:", e)
