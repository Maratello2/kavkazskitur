import sys
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', username='root', password='qCQFo9AD56Tq')

commands = [
    "postconf -e 'myhostname = kavkazskitur.com'",
    "postconf -e 'mydestination = $myhostname, localhost, localhost.localdomain, kavkazskitur.com, kavkazskitur.ru'",
    "postconf -e 'virtual_alias_maps = hash:/etc/postfix/virtual'",
    "echo -e 'info@kavkazskitur.com tflancer@yandex.ru, root\\ninfo@kavkazskitur.ru tflancer@yandex.ru, root\\nnoreply@kavkazskitur.com root' > /etc/postfix/virtual",
    "postmap /etc/postfix/virtual",
    "systemctl restart postfix"
]

for cmd in commands:
    print(f">> {cmd}")
    _, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print(out)
    if err:
        print("[ERR]", err)

ssh.close()
print("Postfix configuration updated.")
