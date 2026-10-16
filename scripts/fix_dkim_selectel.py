import json
import urllib.request
import urllib.error
import time

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

DKIM_RU = "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1ZYdil+MPbHKlv0zXcHFHQhYdMnz8LWaJ6hqdvJq4xbM6jLPRuCFnV29eONxu15HK3ZpZdyTxiKAtb6lb/SUkPcViYIPPu55+sERKKFMK+nTLCTKYz2e0Zvdpsp+OtCNKxdgmIaqKYfFxVzt0Teu/XxuOdyN4vY262PTYTaGxMQIDAQAB"
DKIM_COM = "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5cyd23cuhj9R0knhEdme1Hm1D6+st6G+91P56atWhqkp2LrTSkSHjN71u9x6bDMmgkCZEut4FKtgINCaVakiQvEnvKB+0qatKRO2gyxvB5qmSZosRyTdMZSIrny7OpWT7x5LFJCRNp4R2eTgztU30zqvn/Ivh1lx+0BJdHBSIHQIDAQAB"

zones_url = "https://api.selectel.ru/domains/v2/zones"
req_zones = urllib.request.Request(zones_url, headers={"X-Auth-Token": token, "User-Agent": "domains-go-v2"})
with urllib.request.urlopen(req_zones) as res:
    zones = json.loads(res.read().decode('utf-8')).get('result', [])

for z in zones:
    z_name = z['name']
    z_id = z['id']
    if z_name not in ['kavkazskitur.ru.', 'kavkazskitur.com.']:
        continue
        
    print(f"\n==========================================")
    print(f"Processing Zone: {z_name} ({z_id})")
    
    rr_url = f"https://api.selectel.ru/domains/v2/zones/{z_id}/rrset"
    req_rr = urllib.request.Request(rr_url, headers={"X-Auth-Token": token, "User-Agent": "domains-go-v2"})
    with urllib.request.urlopen(req_rr) as r_rr:
        records = json.loads(r_rr.read().decode('utf-8')).get('result', [])
        
    target_dkim = DKIM_RU if 'ru' in z_name else DKIM_COM
    
    for r in records:
        if 'domainkey' in r.get('name', ''):
            rrset_id = r['id']
            print(f"Deleting existing DKIM RRSet {rrset_id}...")
            del_req = urllib.request.Request(
                f"https://api.selectel.ru/domains/v2/zones/{z_id}/rrset/{rrset_id}",
                headers={"X-Auth-Token": token, "User-Agent": "domains-go-v2"},
                method="DELETE"
            )
            try:
                with urllib.request.urlopen(del_req) as del_res:
                    print("Deleted successfully.")
            except Exception as e:
                print("Delete failed:", e)
                
    time.sleep(1)
    
    # Create exact new DKIM rrset
    dkim_name = f"mail._domainkey.{z_name}"
    print(f"Creating exact new DKIM rrset for {dkim_name}...")
    new_payload = {
        "name": dkim_name,
        "type": "TXT",
        "ttl": 3600,
        "records": [{"content": f"\"{target_dkim}\""}]
    }
    create_req = urllib.request.Request(
        f"https://api.selectel.ru/domains/v2/zones/{z_id}/rrset",
        data=json.dumps(new_payload).encode('utf-8'),
        headers={"X-Auth-Token": token, "Content-Type": "application/json", "User-Agent": "domains-go-v2"},
        method="POST"
    )
    with urllib.request.urlopen(create_req) as cr_res:
        print(f"SUCCESS: Created exact DKIM for {dkim_name} (Code: {cr_res.getcode()})")

print("\nALL DKIM RECORDS UPDATED IN SELECTEL!")
