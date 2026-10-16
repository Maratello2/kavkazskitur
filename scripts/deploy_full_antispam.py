import paramiko
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

commands = """
echo "====================================================="
echo "   DEPLOYING MULTI-LAYERED ANTISPAM INFRASTRUCTURE   "
echo "====================================================="

echo "--- 1. Installing Dovecot Sieve & Fail2ban ---"
DEBIAN_FRONTEND=noninteractive apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq dovecot-sieve dovecot-managesieved fail2ban

echo "--- 2. Configuring Postfix Anti-Spam & DNSBL Checks ---"
postconf -e "smtpd_helo_required = yes"
postconf -e "smtpd_helo_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_invalid_helo_hostname, reject_non_fqdn_helo_hostname"
postconf -e "smtpd_sender_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_non_fqdn_sender, reject_unknown_sender_domain"
postconf -e "smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_non_fqdn_recipient, reject_unknown_recipient_domain, reject_unauth_destination, reject_rbl_client zen.spamhaus.org=127.0.0.[2..11], reject_rbl_client b.barracudacentral.org, reject_rbl_client bl.spamcop.net"
postconf -e "disable_vrfy_command = yes"

echo "--- 3. Configuring Rspamd Strict Thresholds & Bayes ---"
mkdir -p /etc/rspamd/local.d

cat << 'EOF' > /etc/rspamd/local.d/actions.conf
reject = 11;
add_header = 5;
greylist = 3;
EOF

cat << 'EOF' > /etc/rspamd/local.d/milter_headers.conf
use = ["x-spam-header", "x-spam-level", "x-spam-status", "authentication-results"];
extended_spam_headers = true;
EOF

cat << 'EOF' > /etc/rspamd/local.d/classifier-bayes.conf
backend = "redis";
servers = "127.0.0.1:6379";
autolearn = true;
EOF

systemctl restart redis-server
systemctl restart rspamd

echo "--- 4. Configuring Dovecot Pigeonhole Sieve Auto-Move to Junk ---"
# Add sieve plugin to lmtp in dovecot.conf
if ! grep -q "sieve" /etc/dovecot/dovecot.conf; then
    sed -i '/service lmtp {/i protocol lmtp {\n  mail_plugins = $mail_plugins sieve\n}\n' /etc/dovecot/dovecot.conf
fi

mkdir -p /etc/dovecot/sieve
cat << 'EOF' > /etc/dovecot/sieve/default.sieve
require ["fileinto", "mailbox"];

if anyof (
    header :contains "X-Spam" "Yes",
    header :contains "X-Spam-Status" "Yes",
    header :contains "X-Spam-Flag" "YES"
) {
    fileinto :create "Junk";
    stop;
}
EOF

sievec /etc/dovecot/sieve/default.sieve
chown -R vmail:vmail /etc/dovecot/sieve
chmod -R 750 /etc/dovecot/sieve

# Configure plugin block in 90-sieve.conf or dovecot.conf
cat << 'EOF' > /etc/dovecot/conf.d/90-sieve-custom.conf
plugin {
  sieve = file:~/sieve;active=~/.dovecot.sieve
  sieve_default = /etc/dovecot/sieve/default.sieve
  sieve_global = /etc/dovecot/sieve/
}
EOF

# Ensure Junk folder is auto-subscribed
cat << 'EOF' > /etc/dovecot/conf.d/15-mailboxes-custom.conf
namespace inbox {
  mailbox Junk {
    auto = subscribe
    special_use = \Junk
  }
  mailbox Trash {
    auto = subscribe
    special_use = \Trash
  }
  mailbox Sent {
    auto = subscribe
    special_use = \Sent
  }
}
EOF

echo "--- 5. Configuring Fail2ban for Postfix & Dovecot ---"
cat << 'EOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime = 86400
findtime = 600
maxretry = 5

[postfix]
enabled = true
port = smtp,ssmtp,submission
logpath = /var/log/mail.log

[postfix-sasl]
enabled = true
port = smtp,ssmtp,submission,imap,imaps,pop3,pop3s
logpath = /var/log/mail.log

[dovecot]
enabled = true
port = pop3,pop3s,imap,imaps,submission
logpath = /var/log/mail.log
EOF

systemctl restart fail2ban
systemctl restart dovecot
systemctl restart postfix

echo "--- 6. Training Rspamd Bayes on known spam files ---"
find /var/mail/vhosts -type f -exec grep -l "X-Spam: Yes" {} + | while read spamfile; do
    echo "Learning spam: $spamfile"
    rspamc learn_spam < "$spamfile"
done

echo ""
echo "--- 7. Verifying services status ---"
systemctl is-active rspamd
systemctl is-active dovecot
systemctl is-active postfix
systemctl is-active fail2ban

echo ""
echo "====================================================="
echo "   ANTISPAM INFRASTRUCTURE DEPLOYED SUCCESSFULLY     "
echo "====================================================="
"""

_, stdout, stderr = ssh.exec_command(commands)
print(stdout.read().decode('utf-8', errors='replace'))
print(stderr.read().decode('utf-8', errors='replace'))
ssh.close()
