#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/snappy_inspect.txt 2>&1
DOMAINS_DIR="/var/www/mail.kavkazskitur.ru/data/_data_/_default_/domains"
echo "=== DISABLED FILE ==="
cat "$DOMAINS_DIR/disabled" 2>/dev/null
echo ""
echo "=== GMAIL.COM.JSON ==="
cat "$DOMAINS_DIR/gmail.com.json" 2>/dev/null
echo ""
echo "=== KAVKAZSKITUR.JSON ==="
cat "$DOMAINS_DIR/kavkazskitur.json" 2>/dev/null
