#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/mail_log_check.txt 2>&1
echo "=== 1. Checking /var/log/mail.log ==="
tail -n 40 /var/log/mail.log

echo ""
echo "=== 2. Checking /var/www/gotoelbrus.ru/.env ==="
cat /var/www/gotoelbrus.ru/.env 2>/dev/null

echo ""
echo "=== 3. Checking Maildir directories ==="
ls -la /var/mail/vhosts/
ls -la /var/mail/vhosts/kavkazskitur.ru/ 2>/dev/null
ls -la /var/mail/vhosts/kavkazskitur.ru/info/ 2>/dev/null
ls -la /var/mail/vhosts/kavkazskitur.ru/info/Maildir/ 2>/dev/null
ls -la /var/mail/vhosts/kavkazskitur.ru/info/Maildir/new/ 2>/dev/null

echo ""
echo "=== 4. Test sending mail with mail command ==="
echo "Test message from root to info@kavkazskitur.ru" | mail -s "Test Email Direct" info@kavkazskitur.ru
sleep 2
tail -n 15 /var/log/mail.log
