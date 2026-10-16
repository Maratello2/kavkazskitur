import paramiko
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
echo "=== 1. Inspecting existing emails in Maildir ==="
find /var/mail/vhosts -type f | while read f; do
    echo "--- File: $f ---"
    grep -E '^(From|To|Subject|Date|X-Spam):' "$f" | head -n 8
done

echo ""
echo "=== 2. Rspamd Status & Config ==="
systemctl status rspamd --no-pager | head -n 5
rspamadm configdump actions 2>/dev/null || cat /etc/rspamd/actions.conf 2>/dev/null

echo ""
echo "=== 3. DKIM Signing Config ==="
cat /etc/rspamd/local.d/dkim_signing.conf 2>/dev/null
ls -la /var/lib/rspamd/dkim/

echo ""
echo "=== 4. Postfix Antispam Restrictions ==="
postconf smtpd_recipient_restrictions smtpd_relay_restrictions smtpd_helo_restrictions smtpd_sender_restrictions

echo ""
echo "=== 5. Dovecot Pigeonhole / Sieve Status ==="
which sieve-filter || echo "Sieve not installed"
dpkg -l | grep -i dovecot-sieve || echo "dovecot-sieve not package installed"

echo ""
echo "=== 6. Outbound port 25 test to Gmail and Yandex ==="
nc -z -w 3 mx.yandex.ru 25 && echo "Outbound 25 to Yandex: OPEN" || echo "Outbound 25 to Yandex: BLOCKED"
nc -z -w 3 gmail-smtp-in.l.google.com 25 && echo "Outbound 25 to Gmail: OPEN" || echo "Outbound 25 to Gmail: BLOCKED"

echo ""
echo "=== 7. Reverse DNS (PTR) for 161.104.35.24 ==="
host 161.104.35.24 2>/dev/null || dig -x 161.104.35.24 +short 2>/dev/null
"""

_, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
ssh.close()
