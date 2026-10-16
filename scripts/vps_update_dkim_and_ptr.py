import json
import urllib.request
import urllib.error

# 1. Authenticate with Selectel
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
print(f"Token obtained: {token[:20]}...")

zones = {
    "kavkazskitur.ru.": "f5e6323a-9300-4e35-bea1-c431ad354b51",
    "kavkazskitur.com.": "02a7aca5-4ec7-46a7-b5fc-f3691aa064fb"
}

DKIM_RU = "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1ZYdil+MPbHKlv0zXcHFHQhYdMnz8LWaJ6hqdvJq4xbM6jLPRuCFnV29eONxu15HK3ZpZdyTxiKAtb6lb/SUkPcViYIPPu55+sERKKFMK+nTLCTKYz2e0Zvdpsp+OtCNKxdgmIaqKYfFxVzt0Teu/XxuOdyN4vY262PTYTaGxMQIDAQAB"
DKIM_COM = "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5cyd23cuhj9R0knhEdme1Hm1D6+st6G+91P56atWhqkp2LrTSkSHjN71u9x6bDMmgkCZEut4FKtgINCaVakiQvEnvKB+0qatKRO2gyxvB5qmSZosRyTdMZSIrny7OpWT7x5LFJCRNp4R2eTgztU30zqvn/Ivh1lx+0BJdHBSIHQIDAQAB"

def update_zone_dkim(zone_name, dkim_val):
    zone_id = zones.get(zone_name)
    url = f"https://api.selectel.ru/domains/v2/zones/{zone_id}/rrset"
    req = urllib.request.Request(url, headers={"X-Auth-Token": token, "User-Agent": "domains-go-v2"})
    with urllib.request.urlopen(req) as res:
        rrsets = json.loads(res.read().decode('utf-8')).get('rrsets', [])
    
    target_rrset = None
    for r in rrsets:
        if 'domainkey' in r.get('name', ''):
            target_rrset = r
            print(f"Found existing DKIM rrset: {r['id']}, name: {r['name']}, records: {r.get('records')}")
            break
            
    if target_rrset:
        print(f"Updating existing RRSet {target_rrset['id']} via PUT...")
        put_url = f"https://api.selectel.ru/domains/v2/zones/{zone_id}/rrset/{target_rrset['id']}"
        put_payload = {
            "ttl": 3600,
            "records": [{"content": f"\"{dkim_val}\""}]
        }
        put_req = urllib.request.Request(
            put_url,
            data=json.dumps(put_payload).encode('utf-8'),
            headers={"X-Auth-Token": token, "Content-Type": "application/json", "User-Agent": "domains-go-v2"},
            method="PUT"
        )
        with urllib.request.urlopen(put_req) as p_res:
            print(f"SUCCESS: Updated DKIM for {zone_name} (Code: {p_res.getcode()})")
    else:
        print(f"Creating new DKIM RRSet for mail._domainkey.{zone_name}...")
        new_payload = {
            "name": f"mail._domainkey.{zone_name}",
            "type": "TXT",
            "ttl": 3600,
            "records": [{"content": f"\"{dkim_val}\""}]
        }
        post_req = urllib.request.Request(
            url,
            data=json.dumps(new_payload).encode('utf-8'),
            headers={"X-Auth-Token": token, "Content-Type": "application/json", "User-Agent": "domains-go-v2"},
            method="POST"
        )
        with urllib.request.urlopen(post_req) as cr_res:
            print(f"SUCCESS: Created DKIM for {zone_name} (Code: {cr_res.getcode()})")

print("\n=== Updating kavkazskitur.ru DKIM ===")
update_zone_dkim("kavkazskitur.ru.", DKIM_RU)

print("\n=== Updating kavkazskitur.com DKIM ===")
update_zone_dkim("kavkazskitur.com.", DKIM_COM)
