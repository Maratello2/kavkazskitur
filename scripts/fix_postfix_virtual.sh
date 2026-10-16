#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/fix_virtual_result.txt 2>&1
echo "=== 1. Updating /etc/postfix/virtual ==="
cat << 'EOF' > /etc/postfix/virtual
admin@kavkazskitur.ru info@kavkazskitur.ru
support@kavkazskitur.ru info@kavkazskitur.ru
sales@kavkazskitur.ru info@kavkazskitur.ru
admin@kavkazskitur.com info@kavkazskitur.com
support@kavkazskitur.com info@kavkazskitur.com
EOF

postmap /etc/postfix/virtual

echo "=== 2. Updating Postfix mydestination ==="
postconf -e "mydestination = localhost, localhost.localdomain, \$myhostname, mail.kavkazskitur.ru"

echo "=== 3. Flushing old deferred queue ==="
postsuper -d ALL

echo "=== 4. Restarting Postfix ==="
systemctl restart postfix
systemctl restart dovecot

echo "=== 5. Sending test email directly to info@kavkazskitur.ru ==="
/usr/sbin/sendmail -f noreply@kavkazskitur.ru info@kavkazskitur.ru << 'EOF'
From: noreply@kavkazskitur.ru
To: info@kavkazskitur.ru
Subject: Test Local Delivery Verification
Date: Thu, 16 Oct 2026 14:15:00 +0300

Hello KavKazSkiTur team!
This is an automated test verifying direct local Dovecot LMTP delivery into info@kavkazskitur.ru.
EOF

sleep 2
echo ""
echo "=== 6. Recent Postfix mail log ==="
tail -n 25 /var/log/mail.log

echo ""
echo "=== 7. Checking Maildir contents ==="
ls -la /var/mail/vhosts/kavkazskitur.ru/info/Maildir/new/

echo "=== FIX VIRTUAL COMPLETED ==="
