import urllib.request
import json
import sys
from selectel_client import get_project_token

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

token = get_project_token()
server_id = "09059284-6c3f-43b1-949a-20ca0ca5a39c"
url = f"https://ru-2.cloud.api.selcloud.ru/compute/v2.1/servers/{server_id}/action"

# 1. Get VNC Console URL
payload = {"os-getVNCConsole": {"type": "novnc"}}
req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={"X-Auth-Token": token, "Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req) as r:
        vnc_url = json.loads(r.read())['console']['url']
        print(f"\nVNC Console URL: {vnc_url}")
except Exception as e:
    print(f"VNC Console Error: {e}")

# 2. Get Console Output (last 25 lines)
payload_log = {"os-getConsoleOutput": {"length": 25}}
req_log = urllib.request.Request(url, data=json.dumps(payload_log).encode('utf-8'), headers={"X-Auth-Token": token, "Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req_log) as r:
        log_out = json.loads(r.read())['output']
        print(f"\nConsole Output (last 25 lines):\n{log_out}")
except Exception as e:
    print(f"Console Output Error: {e}")
