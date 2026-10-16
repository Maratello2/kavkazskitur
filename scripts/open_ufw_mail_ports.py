import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
echo "=== Opening Mail Ports in UFW ==="
ufw allow 993/tcp comment 'IMAP SSL'
ufw allow 143/tcp comment 'IMAP STARTTLS'
ufw allow 465/tcp comment 'SMTP SSL'
ufw allow 587/tcp comment 'Submission'
ufw allow 25/tcp comment 'SMTP Inbound'
ufw reload
ufw status verbose
"""

_, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
