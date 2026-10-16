#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/mail_fix_result.txt 2>&1
echo "========================================="
echo "   APPLYING COMPLETE MAIL SERVER FIX"
echo "========================================="

echo "--- 1. Fixing /etc/dovecot/users ---"
H=$(doveadm pw -s SHA512-CRYPT -p 'Kavkaz2026!Mail')
echo "info@kavkazskitur.ru:$H" > /etc/dovecot/users
echo "info@kavkazskitur.com:$H" >> /etc/dovecot/users
chmod 640 /etc/dovecot/users
chown root:dovecot /etc/dovecot/users
systemctl restart dovecot
echo "Dovecot users file contents:"
cat /etc/dovecot/users

echo ""
echo "--- 2. Testing Dovecot local auth ---"
doveadm auth test info@kavkazskitur.ru 'Kavkaz2026!Mail'
if [ $? -eq 0 ]; then
    echo "SUCCESS: info@kavkazskitur.ru authenticated successfully!"
else
    echo "ERROR: info@kavkazskitur.ru authentication failed!"
fi

doveadm auth test info@kavkazskitur.com 'Kavkaz2026!Mail'
if [ $? -eq 0 ]; then
    echo "SUCCESS: info@kavkazskitur.com authenticated successfully!"
else
    echo "ERROR: info@kavkazskitur.com authentication failed!"
fi

echo ""
echo "--- 3. Locating SnappyMail directories ---"
DATA_DIR="/var/www/mail.kavkazskitur.ru/data/_data_/_default_"
if [ ! -d "$DATA_DIR" ]; then
    mkdir -p "$DATA_DIR"
fi
DOMAINS_DIR="$DATA_DIR/domains"
mkdir -p "$DOMAINS_DIR"

if [ -f "$DATA_DIR/admin_password.txt" ]; then
    echo "SnappyMail Admin password:"
    cat "$DATA_DIR/admin_password.txt"
    echo ""
else
    echo "No admin_password.txt found at $DATA_DIR"
fi

echo "--- 4. Writing SnappyMail domain configurations ---"
cat << 'EOF' > "$DOMAINS_DIR/kavkazskitur.ru.json"
{
  "name": "kavkazskitur.ru",
  "disabled": false,
  "alias": false,
  "imap": {
    "host": "127.0.0.1",
    "port": 143,
    "secure": "None",
    "short_login": false
  },
  "smtp": {
    "host": "127.0.0.1",
    "port": 25,
    "secure": "None",
    "short_login": false
  },
  "white_list": ""
}
EOF

cat << 'EOF' > "$DOMAINS_DIR/kavkazskitur.com.json"
{
  "name": "kavkazskitur.com",
  "disabled": false,
  "alias": false,
  "imap": {
    "host": "127.0.0.1",
    "port": 143,
    "secure": "None",
    "short_login": false
  },
  "smtp": {
    "host": "127.0.0.1",
    "port": 25,
    "secure": "None",
    "short_login": false
  },
  "white_list": ""
}
EOF

cat << 'EOF' > "$DOMAINS_DIR/*.json"
{
  "name": "*",
  "disabled": false,
  "alias": false,
  "imap": {
    "host": "127.0.0.1",
    "port": 143,
    "secure": "None",
    "short_login": false
  },
  "smtp": {
    "host": "127.0.0.1",
    "port": 25,
    "secure": "None",
    "short_login": false
  },
  "white_list": ""
}
EOF

# Also make copies with .ini format just in case older rainloop engine parses .ini
cat << 'EOF' > "$DOMAINS_DIR/kavkazskitur.ru.ini"
imap_host = "127.0.0.1"
imap_port = 143
imap_secure = "None"
imap_short_login = Off
smtp_host = "127.0.0.1"
smtp_port = 25
smtp_secure = "None"
smtp_short_login = Off
smtp_auth = On
smtp_php_mail = Off
EOF

cat << 'EOF' > "$DOMAINS_DIR/kavkazskitur.com.ini"
imap_host = "127.0.0.1"
imap_port = 143
imap_secure = "None"
imap_short_login = Off
smtp_host = "127.0.0.1"
smtp_port = 25
smtp_secure = "None"
smtp_short_login = Off
smtp_auth = On
smtp_php_mail = Off
EOF

cat << 'EOF' > "$DOMAINS_DIR/default.ini"
imap_host = "127.0.0.1"
imap_port = 143
imap_secure = "None"
imap_short_login = Off
smtp_host = "127.0.0.1"
smtp_port = 25
smtp_secure = "None"
smtp_short_login = Off
smtp_auth = On
smtp_php_mail = Off
EOF

chown -R www-data:www-data /var/www/mail.kavkazskitur.ru/data
chmod -R 775 /var/www/mail.kavkazskitur.ru/data

echo ""
echo "--- 5. Domain files created ---"
ls -la "$DOMAINS_DIR"

echo ""
echo "--- 6. Services status ---"
systemctl status postfix --no-pager | head -n 5
systemctl status dovecot --no-pager | head -n 5
systemctl status rspamd --no-pager | head -n 5

echo ""
echo "========================================="
echo "   MAIL SERVER FIX COMPLETED"
echo "========================================="
