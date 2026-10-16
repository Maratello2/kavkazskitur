import paramiko
import socket
import ssl
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

# Clear log marker or read current journal
_, out, _ = ssh.exec_command('journalctl -u dovecot -n 5 --no-pager')
print("Current dovecot log tail:")
print(out.read().decode())

# Attempt an external connection
print("Attempting external connection to mail.kavkazskitur.ru:993...")
try:
    ctx = ssl.create_default_context()
    s = socket.create_connection(('mail.kavkazskitur.ru', 993), timeout=5)
    ss = ctx.wrap_socket(s, server_hostname='mail.kavkazskitur.ru')
    print("Wrapped socket OK!")
    ss.close()
except Exception as e:
    print(f"Connection failed: {e}")

time.sleep(1)

# Check dovecot logs now
print("\nDovecot log after connection attempt:")
_, out, _ = ssh.exec_command('journalctl -u dovecot -n 15 --no-pager')
print(out.read().decode())

# Check Postfix log as well
print("\nPostfix/mail log after connection attempt:")
_, out, _ = ssh.exec_command('tail -n 15 /var/log/mail.log')
print(out.read().decode())

ssh.close()
