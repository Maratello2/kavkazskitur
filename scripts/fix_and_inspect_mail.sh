#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/mail_diag.txt 2>&1
echo "=== 1. FIXING DOVECOT USERS ==="
H=$(doveadm pw -s SHA512-CRYPT -p 'Kavkaz2026!Mail')
echo "info@kavkazskitur.ru:$H" > /etc/dovecot/users
echo "info@kavkazskitur.com:$H" >> /etc/dovecot/users
chmod 640 /etc/dovecot/users
chown root:dovecot /etc/dovecot/users
systemctl restart dovecot
echo "Dovecot users file:"
cat /etc/dovecot/users
echo "Testing dovecot auth for info@kavkazskitur.ru:"
doveadm auth test info@kavkazskitur.ru 'Kavkaz2026!Mail'
echo "Testing dovecot auth for info@kavkazskitur.com:"
doveadm auth test info@kavkazskitur.com 'Kavkaz2026!Mail'

echo ""
echo "=== 2. CHECKING SNAPPYMAIL FILES ==="
find /var/www/mail.kavkazskitur.ru /var/lib/snappymail -name "admin_password.txt" -o -type d -name "domains" -o -name "application.ini" 2>/dev/null

ADMIN_PW_FILE=$(find /var/www/mail.kavkazskitur.ru /var/lib/snappymail -name "admin_password.txt" 2>/dev/null | head -n 1)
if [ -n "$ADMIN_PW_FILE" ]; then
    echo "Found admin password file: $ADMIN_PW_FILE"
    echo "Admin password is:"
    cat "$ADMIN_PW_FILE"
    echo ""
fi

DOMAINS_DIR=$(find /var/www/mail.kavkazskitur.ru /var/lib/snappymail -type d -name "domains" 2>/dev/null | head -n 1)
if [ -n "$DOMAINS_DIR" ]; then
    echo "Found domains directory: $DOMAINS_DIR"
    ls -la "$DOMAINS_DIR"
    echo "Existing domain files content:"
    for f in "$DOMAINS_DIR"/*; do
        if [ -f "$f" ]; then
            echo "--- $f ---"
            cat "$f"
            echo ""
        fi
    done
fi

echo ""
echo "=== 3. CHECKING POSTFIX AND DOVECOT STATUS ==="
systemctl is-active postfix
systemctl is-active dovecot
systemctl is-active rspamd

echo "=== FIX & INSPECT COMPLETE ==="
