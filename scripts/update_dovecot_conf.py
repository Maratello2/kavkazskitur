import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
sed -i 's|/etc/letsencrypt/live/kavkazskitur.ru/|/etc/letsencrypt/live/mail.kavkazskitur.ru/|g' /etc/dovecot/dovecot.conf
systemctl restart dovecot
systemctl is-active dovecot
doveconf -n | grep -i ssl
"""

_, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
