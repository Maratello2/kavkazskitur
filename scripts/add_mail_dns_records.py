import sys
import json
import urllib.request
sys.path.append('scripts')
from selectel_client import get_project_token

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

token = get_project_token()
print("Selectel token obtained.")

# DKIM public key from rspamd
DKIM_VAL = "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1ZYdil+MPbHKlv0zXCHFHQhYdMnz8LWaJ6hqdvJq4xbM6JLPRuCFnv29eONxu15HK32pZdyTxiKAtb6lb/SUkPcViYIPPu55+sERKKFMK+nTLCTKYz2e02vdpsp+0tCNkxdgmIaqKYFfxVzt0Teu/Xxu0dyN4vY262PTYTaGxMQIDAQAB"

# Load original zones
with open("scripts/dns_backup_original.json", "r", encoding="utf-8") as f:
    backup_data = json.load(f)

zones = {
    "kavkazskitur.ru.": backup_data["kavkazskitur.ru."]["zone_info"]["id"],
    "kavkazskitur.com.": backup_data["kavkazskitur.com."]["zone_info"]["id"]
}

def create_rrset(zone_id, name, rr_type, ttl, records):
    url = f"https://api.selectel.ru/domains/v2/zones/{zone_id}/rrset"
    payload = {
        "name": name,
        "type": rr_type,
        "ttl": ttl,
        "records": records
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            "X-Auth-Token": token,
            "Content-Type": "application/json",
            "User-Agent": "domains-go-v2"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as res:
            print(f"SUCCESS: Created {rr_type} for {name} (Status: {res.getcode()})")
            return json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"FAILED {rr_type} for {name}: HTTP {e.code} -> {e.read().decode('utf-8')}")

# 1. kavkazskitur.ru.
ru_zone = zones["kavkazskitur.ru."]
print("\n=== Adding DNS records to kavkazskitur.ru. ===")
create_rrset(ru_zone, "mail.kavkazskitur.ru.", "A", 3600, [{"content": "161.104.35.24"}])
create_rrset(ru_zone, "kavkazskitur.ru.", "MX", 3600, [{"content": "10 mail.kavkazskitur.ru."}])
create_rrset(ru_zone, "kavkazskitur.ru.", "TXT", 3600, [{"content": "\"v=spf1 mx a:mail.kavkazskitur.ru ip4:161.104.35.24 ~all\""}])
create_rrset(ru_zone, "mail._domainkey.kavkazskitur.ru.", "TXT", 3600, [{"content": f"\"{DKIM_VAL}\""}])
create_rrset(ru_zone, "_dmarc.kavkazskitur.ru.", "TXT", 3600, [{"content": "\"v=DMARC1; p=none; sp=none; rua=mailto:admin@kavkazskitur.ru\""}])

# 2. kavkazskitur.com.
com_zone = zones["kavkazskitur.com."]
print("\n=== Adding DNS records to kavkazskitur.com. ===")
create_rrset(com_zone, "mail.kavkazskitur.com.", "A", 3600, [{"content": "161.104.35.24"}])
create_rrset(com_zone, "kavkazskitur.com.", "MX", 3600, [{"content": "10 mail.kavkazskitur.ru."}])
create_rrset(com_zone, "kavkazskitur.com.", "TXT", 3600, [{"content": "\"v=spf1 mx a:mail.kavkazskitur.ru ip4:161.104.35.24 ~all\""}])
create_rrset(com_zone, "_dmarc.kavkazskitur.com.", "TXT", 3600, [{"content": "\"v=DMARC1; p=none; sp=none; rua=mailto:admin@kavkazskitur.ru\""}])

print("\nALL DNS RECORDS PROCESSED.")
