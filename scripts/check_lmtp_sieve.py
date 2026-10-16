import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
cat << 'EOF' > /etc/dovecot/conf.d/90-sieve-custom.conf
protocol lmtp {
  mail_plugins = $mail_plugins sieve
}

plugin {
  sieve = file:~/sieve;active=~/.dovecot.sieve
  sieve_default = /etc/dovecot/sieve/default.sieve
  sieve_global = /etc/dovecot/sieve/
}
EOF

systemctl restart dovecot
doveconf -n | grep -A 5 "protocol lmtp"
doveconf -n | grep -A 5 "plugin {"
"""

_, out, _ = ssh.exec_command(cmd)
print(out.read().decode())
ssh.close()
