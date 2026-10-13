import sys
import json
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', username='root', password='qCQFo9AD56Tq')

test_payload = json.dumps({
    "name": "Dmitry Expedition Tester",
    "phone": "+7 928 111-22-33",
    "tourName": "Elbrus North Classic 10 Days",
    "dates": "September 2026",
    "comment": "Testing leads pipeline on gotoelbrus.ru with email dispatch.",
    "consent": True,
    "website_hp": ""
})

# 1. Post lead via curl to gotoelbrus.ru
print("=== Submitting test lead to gotoelbrus.ru ===")
cmd_curl = f"""curl -s -k -X POST https://gotoelbrus.ru/api/leads \\
  -H "Content-Type: application/json" \\
  -d '{test_payload}'"""

_, stdout, stderr = ssh.exec_command(cmd_curl)
resp = stdout.read().decode('utf-8', errors='replace')
print("Lead API Response:", resp)

# 2. Check data/leads.json on gotoelbrus.ru
print("\n=== Checking /var/www/gotoelbrus.ru/data/leads.json ===")
cmd_leads = "head -n 25 /var/www/gotoelbrus.ru/data/leads.json"
_, stdout, stderr = ssh.exec_command(cmd_leads)
print(stdout.read().decode('utf-8', errors='replace'))

# 3. Check Postfix mail log for delivery
print("\n=== Checking Postfix mail log ===")
cmd_mail = "tail -n 12 /var/log/mail.log"
_, stdout, stderr = ssh.exec_command(cmd_mail)
print(stdout.read().decode('utf-8', errors='replace'))

ssh.close()
