import paramiko
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

commands = """
echo "=== 1. Setting permissions on letsencrypt certificates ==="
chmod 755 /etc/letsencrypt/live
chmod 755 /etc/letsencrypt/archive
chmod 755 /etc/letsencrypt/live/mail.kavkazskitur.ru
chmod 755 /etc/letsencrypt/archive/mail.kavkazskitur.ru
chmod 644 /etc/letsencrypt/archive/mail.kavkazskitur.ru/*

echo "=== 2. Configuring Dovecot SSL ==="
sed -i 's|^ssl_cert = .*|ssl_cert = </etc/letsencrypt/live/mail.kavkazskitur.ru/fullchain.pem|g' /etc/dovecot/conf.d/10-ssl.conf
sed -i 's|^ssl_key = .*|ssl_key = </etc/letsencrypt/live/mail.kavkazskitur.ru/privkey.pem|g' /etc/dovecot/conf.d/10-ssl.conf
grep -E '^ssl_cert|^ssl_key' /etc/dovecot/conf.d/10-ssl.conf

echo "=== 3. Configuring Postfix SSL ==="
postconf -e "smtpd_tls_cert_file = /etc/letsencrypt/live/mail.kavkazskitur.ru/fullchain.pem"
postconf -e "smtpd_tls_key_file = /etc/letsencrypt/live/mail.kavkazskitur.ru/privkey.pem"
postconf smtpd_tls_cert_file smtpd_tls_key_file

echo "=== 4. Verifying master.cf for submission and smtps ==="
# Ensure submission (587) and smtps (465) are enabled and configured properly
sed -i '/^submission/d' /etc/postfix/master.cf
sed -i '/^smtps/d' /etc/postfix/master.cf

cat << 'EOF' >> /etc/postfix/master.cf
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING

smtps     inet  n       -       y       -       -       smtpd
  -o syslog_name=postfix/smtps
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
EOF

echo "=== 5. Restarting Dovecot and Postfix ==="
systemctl restart dovecot
systemctl restart postfix

echo "=== 6. Checking Dovecot and Postfix status ==="
systemctl is-active dovecot
systemctl is-active postfix

echo "=== 7. Local OpenSSL tests ==="
openssl s_client -connect 127.0.0.1:993 -brief < /dev/null
openssl s_client -connect 127.0.0.1:465 -brief < /dev/null
openssl s_client -connect 127.0.0.1:587 -starttls smtp -brief < /dev/null
"""

_, stdout, stderr = ssh.exec_command(commands)
print(stdout.read().decode('utf-8', errors='replace'))
print(stderr.read().decode('utf-8', errors='replace'))
ssh.close()
