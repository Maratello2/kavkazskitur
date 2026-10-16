import sys
import json
import urllib.request
sys.path.append('scripts')
from selectel_client import get_project_token

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

token = get_project_token()

with open("scripts/dns_backup_original.json", "r", encoding="utf-8") as f:
    backup_data = json.load(f)

ru_zone_id = backup_data["kavkazskitur.ru."]["zone_info"]["id"]
com_zone_id = backup_data["kavkazskitur.com."]["zone_info"]["id"]

# Fetch current rrsets for kavkazskitur.ru
req = urllib.request.Request(
    f"https://api.selectel.ru/domains/v2/zones/{ru_zone_id}/rrset",
    headers={"X-Auth-Token": token, "User-Agent": "domains-go-v2"}
)
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))
    print("kavkazskitur.ru RRsets found:", len(data.get('rrsets', [])))
    for r in data.get('rrsets', []):
        if 'domainkey' in r.get('name', ''):
            print("Found DKIM rrset:", r)

# Fetch current rrsets for kavkazskitur.com
req = urllib.request.Request(
    f"https://api.selectel.ru/domains/v2/zones/{com_zone_id}/rrset",
    headers={"X-Auth-Token": token, "User-Agent": "domains-go-v2"}
)
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))
    print("kavkazskitur.com RRsets found:", len(data.get('rrsets', [])))
    for r in data.get('rrsets', []):
        if 'domainkey' in r.get('name', ''):
            print("Found com DKIM rrset:", r)
