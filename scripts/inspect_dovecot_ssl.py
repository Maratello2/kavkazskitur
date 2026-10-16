import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
echo "=== Grep ssl_cert in /etc/dovecot ==="
grep -rn 'ssl_cert' /etc/dovecot/

echo "=== Grep ssl_key in /etc/dovecot ==="
grep -rn 'ssl_key' /etc/dovecot/

echo "=== Dovecot -n SSL output ==="
doveconf -n | grep -i ssl

echo "=== Testing certificate subject in /etc/letsencrypt/live/mail.kavkazskitur.ru ==="
openssl x509 -in /etc/letsencrypt/live/mail.kavkazskitur.ru/fullchain.pem -noout -subject -issuer

echo "=== Testing what certificate port 993 presents with SNI ==="
openssl s_client -connect 127.0.0.1:993 -servername mail.kavkazskitur.ru -brief < /dev/null
"""

_, stdout, _ = ssh.exec_command(cmd)
print(stdout.read().decode())
ssh.close()
