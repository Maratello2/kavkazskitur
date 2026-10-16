import json
import urllib.request

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

zones = {
    "kavkazskitur.ru.": "f5e6323a-9300-4e35-bea1-c431ad354b51",
    "kavkazskitur.com.": "02a7aca5-4ec7-46a7-b5fc-f3691aa064fb"
}

for z_name, z_id in zones.items():
    url = f"https://api.selectel.ru/domains/v2/zones/{z_id}/rrset"
    req = urllib.request.Request(url, headers={"X-Auth-Token": token, "User-Agent": "domains-go-v2"})
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        print(f"=== {z_name} ===")
        for r in data.get('rrsets', []):
            print(f"  ID: {r.get('id')}, Name: '{r.get('name')}', Type: {r.get('type')}")
            if 'domainkey' in r.get('name', ''):
                print(f"    Records: {r.get('records')}")
