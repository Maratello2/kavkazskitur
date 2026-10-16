#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/ssl_inspect.txt 2>&1
echo "=== 1. Checking /etc/letsencrypt/live ==="
ls -la /etc/letsencrypt/live/
ls -la /etc/letsencrypt/live/mail.kavkazskitur.ru/ 2>/dev/null
ls -la /etc/letsencrypt/live/kavkazskitur.ru/ 2>/dev/null

echo ""
echo "=== 2. Checking Dovecot SSL config ==="
grep -rn "ssl" /etc/dovecot/conf.d/10-ssl.conf

echo ""
echo "=== 3. Testing local OpenSSL connection to IMAP 993 ==="
echo "" | openssl s_client -connect 127.0.0.1:993 -brief

echo ""
echo "=== 4. Testing local OpenSSL connection to SMTPS 465 ==="
echo "" | openssl s_client -connect 127.0.0.1:465 -brief

echo ""
echo "=== 5. Testing local OpenSSL connection to Submission 587 (STARTTLS) ==="
echo "" | openssl s_client -connect 127.0.0.1:587 -starttls smtp -brief

echo ""
echo "=== 6. Recent Dovecot error log ==="
journalctl -u dovecot -n 30 --no-pager
