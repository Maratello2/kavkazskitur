import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
echo "=== Listening TCP Sockets ==="
ss -tlpn

echo "=== IPTables Input Rules ==="
iptables -L INPUT -n -v

echo "=== UFW Status ==="
ufw status verbose 2>/dev/null || echo "UFW not active"

echo "=== Fail2ban Status ==="
fail2ban-client status 2>/dev/null || echo "Fail2ban not installed"

echo "=== Dovecot 10-master.conf listeners ==="
grep -A 10 'service imap-login' /etc/dovecot/conf.d/10-master.conf
"""

_, stdout, _ = ssh.exec_command(cmd)
print(stdout.read().decode())
ssh.close()
