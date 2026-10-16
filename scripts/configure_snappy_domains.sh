#!/bin/bash
DOMAIN_DIR="/var/www/mail.kavkazskitur.ru/data/_data_/_default_/domains"
mkdir -p "$DOMAIN_DIR"

cat << 'EOF' > "$DOMAIN_DIR/kavkazskitur.ru.json"
{
  "name": "kavkazskitur.ru",
  "imap": {
    "host": "127.0.0.1",
    "port": 143,
    "ssl": 0,
    "timeout": 30
  },
  "smtp": {
    "host": "127.0.0.1",
    "port": 25,
    "ssl": 0,
    "timeout": 30,
    "auth": true,
    "php_mail": false
  }
}
EOF

cat << 'EOF' > "$DOMAIN_DIR/kavkazskitur.com.json"
{
  "name": "kavkazskitur.com",
  "imap": {
    "host": "127.0.0.1",
    "port": 143,
    "ssl": 0,
    "timeout": 30
  },
  "smtp": {
    "host": "127.0.0.1",
    "port": 25,
    "ssl": 0,
    "timeout": 30,
    "auth": true,
    "php_mail": false
  }
}
EOF

cat << 'EOF' > "$DOMAIN_DIR/default.json"
{
  "name": "*",
  "imap": {
    "host": "127.0.0.1",
    "port": 143,
    "ssl": 0,
    "timeout": 30
  },
  "smtp": {
    "host": "127.0.0.1",
    "port": 25,
    "ssl": 0,
    "timeout": 30,
    "auth": true,
    "php_mail": false
  }
}
EOF

chown -R www-data:www-data /var/www/mail.kavkazskitur.ru/data
chmod -R 775 /var/www/mail.kavkazskitur.ru/data
echo "DOMAINS CONFIGURED IN SNAPPYMAIL"
