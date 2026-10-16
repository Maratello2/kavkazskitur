#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/snappy_deploy_result.txt 2>&1
echo "Deploying SnappyMail domain configs..."

DOMAINS_DIR="/var/www/mail.kavkazskitur.ru/data/_data_/_default_/domains"
mkdir -p "$DOMAINS_DIR"

CONFIG_JSON='{
    "IMAP": {
        "host": "127.0.0.1",
        "port": 143,
        "type": 0,
        "timeout": 300,
        "shortLogin": false,
        "lowerLogin": true,
        "sasl": [
            "PLAIN",
            "LOGIN"
        ],
        "ssl": {
            "verify_peer": false,
            "verify_peer_name": false,
            "allow_self_signed": true,
            "SNI_enabled": false,
            "disable_compression": true,
            "security_level": 0
        },
        "disabled_capabilities": [],
        "use_expunge_all_on_delete": false,
        "fast_simple_search": true,
        "force_select": false,
        "message_all_headers": false,
        "message_list_limit": 10000,
        "search_filter": ""
    },
    "SMTP": {
        "host": "127.0.0.1",
        "port": 25,
        "type": 0,
        "timeout": 60,
        "shortLogin": false,
        "lowerLogin": true,
        "sasl": [
            "PLAIN",
            "LOGIN"
        ],
        "ssl": {
            "verify_peer": false,
            "verify_peer_name": false,
            "allow_self_signed": true,
            "SNI_enabled": false,
            "disable_compression": true,
            "security_level": 0
        },
        "useAuth": true,
        "setSender": false,
        "usePhpMail": false
    },
    "Sieve": {
        "host": "",
        "port": 4190,
        "type": 0,
        "timeout": 10,
        "shortLogin": false,
        "lowerLogin": true,
        "ssl": {
            "verify_peer": false,
            "verify_peer_name": false,
            "allow_self_signed": true,
            "SNI_enabled": false,
            "disable_compression": true,
            "security_level": 0
        },
        "enabled": false
    },
    "whiteList": ""
}'

echo "$CONFIG_JSON" > "$DOMAINS_DIR/kavkazskitur.ru.json"
echo "$CONFIG_JSON" > "$DOMAINS_DIR/kavkazskitur.com.json"
echo "$CONFIG_JSON" > "$DOMAINS_DIR/*.json"

# Remove invalid temporary files from previous attempts
rm -f "$DOMAINS_DIR/kavkazskitur.json"
rm -f "$DOMAINS_DIR"/*.ini

chown -R www-data:www-data /var/www/mail.kavkazskitur.ru/data
chmod -R 775 /var/www/mail.kavkazskitur.ru/data

echo "Directory listing of $DOMAINS_DIR:"
ls -la "$DOMAINS_DIR"

echo "Checking syntax of kavkazskitur.ru.json:"
php -r 'json_decode(file_get_contents("'$DOMAINS_DIR'/kavkazskitur.ru.json"), true) ?: exit(1); echo "JSON OK\n";'

echo "=== SNAPPYMAIL DOMAINS DEPLOYED SUCCESSFULLY ==="
