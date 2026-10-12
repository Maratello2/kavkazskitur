import sys
import json
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', username='root', password='qCQFo9AD56Tq')

test_payload = json.dumps({
    "name": "Alexey Test Climber",
    "phone": "+7 999 123-45-67",
    "tourName": "Mount Elbrus South Route 8 Days",
    "dates": "August 2026",
    "comment": "Testing automated email dispatch to admin mailboxes.",
    "consent": True,
    "website_hp": ""
})

# 1. Post lead via curl on localhost to kavkazskitur.com
print("=== Submitting test lead ===")
cmd_curl = f"""curl -s -k -X POST https://kavkazskitur.com/api/leads \\
  -H "Content-Type: application/json" \\
  -d '{test_payload}'"""

_, stdout, stderr = ssh.exec_command(cmd_curl)
resp = stdout.read().decode('utf-8', errors='replace')
print("Lead API Response:", resp)

# 2. Check postfix mail log
print("\n=== Checking Postfix Mail Log ===")
cmd_log = "journalctl -u postfix -n 20 --no-pager"
_, stdout, stderr = ssh.exec_command(cmd_log)
print(stdout.read().decode('utf-8', errors='replace'))

# 3. Check data/leads.json
print("\n=== Checking /var/www/kavkazskitur.com/data/leads.json ===")
cmd_leads = "head -n 25 /var/www/kavkazskitur.com/data/leads.json"
_, stdout, stderr = ssh.exec_command(cmd_leads)
print(stdout.read().decode('utf-8', errors='replace'))

ssh.close()
