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

# Check Ports in ru-2
ports_url = "https://ru-2.cloud.api.selcloud.ru/network/v2.0/ports"
req = urllib.request.Request(ports_url, headers={"X-Auth-Token": token})
try:
    with urllib.request.urlopen(req) as res:
        ports = json.loads(res.read().decode('utf-8')).get('ports', [])
        print(f"Found {len(ports)} network ports:")
        for p in ports:
            print("Port ID:", p.get('id'), "IPs:", p.get('fixed_ips'), "Device ID:", p.get('device_id'))
except Exception as e:
    print("Ports API error:", e)

# Check Floating IPs in ru-2
fips_url = "https://ru-2.cloud.api.selcloud.ru/network/v2.0/floatingips"
req = urllib.request.Request(fips_url, headers={"X-Auth-Token": token})
try:
    with urllib.request.urlopen(req) as res:
        fips = json.loads(res.read().decode('utf-8')).get('floatingips', [])
        print(f"Found {len(fips)} floating IPs:")
        for f in fips:
            print("FIP:", f.get('floating_ip_address'), "ID:", f.get('id'), "Port ID:", f.get('port_id'))
except Exception as e:
    print("FIPs API error:", e)
