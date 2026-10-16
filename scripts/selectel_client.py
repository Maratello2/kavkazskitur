import os
import json
import urllib.request

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDS_FILE = os.path.join(ROOT_DIR, ".selectel_creds.json")

def get_creds():
    if not os.path.exists(CREDS_FILE):
        raise RuntimeError(f"Missing {CREDS_FILE}")
    with open(CREDS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def get_project_token():
    creds = get_creds()
    auth_url = "https://cloud.api.selcloud.ru/identity/v3/auth/tokens"
    payload = {
        "auth": {
            "identity": {
                "methods": ["password"],
                "password": {
                    "user": {
                        "name": creds["user"],
                        "domain": {"name": creds["account"]},
                        "password": creds["password"]
                    }
                }
            },
            "scope": {
                "project": {
                    "name": creds["project"],
                    "domain": {"name": creds["account"]}
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
        return token
