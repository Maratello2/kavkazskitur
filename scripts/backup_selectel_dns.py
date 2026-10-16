import urllib.request
import json
import sys
from selectel_client import get_project_token

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

token = get_project_token()
print("Project-Scoped Token successfully retrieved!")

zones_url = "https://api.selectel.ru/domains/v2/zones"
req_zones = urllib.request.Request(zones_url, headers={"X-Auth-Token": token})

with urllib.request.urlopen(req_zones, timeout=10) as res:
    zones_data = json.loads(res.read().decode('utf-8'))

full_backup = {}
print(f"\nProcessing {len(zones_data.get('result', []))} zones:")

for z in zones_data.get('result', []):
    zone_id = z['id']
    zone_name = z['name']
    print(f"\n==========================================")
    print(f"ZONE: {zone_name} (ID: {zone_id})")
    
    rr_url = f"https://api.selectel.ru/domains/v2/zones/{zone_id}/rrset"
    req_rr = urllib.request.Request(rr_url, headers={"X-Auth-Token": token})
    with urllib.request.urlopen(req_rr, timeout=10) as r_rr:
        rr_data = json.loads(r_rr.read().decode('utf-8'))
        records = rr_data.get('result', [])
        full_backup[zone_name] = {
            "zone_info": z,
            "records": records
        }
        for r in records:
            print(f"  {r['type']:<6} | {r['name']:<30} | TTL: {r.get('ttl'):<5} | {r.get('records')}")

with open("scripts/dns_backup_original.json", "w", encoding="utf-8") as f:
    json.dump(full_backup, f, indent=2, ensure_ascii=False)

print("\n==========================================")
print("SUCCESS: 100% complete DNS backup saved to scripts/dns_backup_original.json")
