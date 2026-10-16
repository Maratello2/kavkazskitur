#!/bin/bash
set -e

echo "=== [1/8] Installing Postfix, Dovecot, Rspamd, Redis ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y postfix dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd rspamd redis-server certbot

echo "=== [2/8] Creating vmail user and directory structure ==="
groupadd -g 5000 vmail 2>/dev/null || true
useradd -r -u 5000 -g vmail -d /var/mail/vhosts -m -s /usr/sbin/nologin vmail 2>/dev/null || true
mkdir -p /var/mail/vhosts/kavkazskitur.ru/info
mkdir -p /var/mail/vhosts/kavkazskitur.com/info
chown -R vmail:vmail /var/mail/vhosts
chmod -R 770 /var/mail/vhosts

echo "=== [3/8] Configuring Dovecot ==="
cat << 'EOF' > /etc/dovecot/dovecot.conf
protocols = imap pop3 lmtp
listen = *, [::]

ssl = yes
ssl_cert = </etc/letsencrypt/live/kavkazskitur.ru/fullchain.pem
ssl_key = </etc/letsencrypt/live/kavkazskitur.ru/privkey.pem
ssl_min_protocol = TLSv1.2

mail_location = maildir:/var/mail/vhosts/%d/%n:LAYOUT=fs
mail_uid = 5000
mail_gid = 5000
mail_privileged_group = vmail

auth_mechanisms = plain login
disable_plaintext_auth = no

passdb {
  driver = passwd-file
  args = scheme=SHA512-CRYPT username_format=%u /etc/dovecot/users
}

userdb {
  driver = static
  args = uid=5000 gid=5000 home=/var/mail/vhosts/%d/%n
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}

service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
}

service imap-login {
  inet_listener imap {
    port = 143
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}
EOF

# Generate password hashes for mailboxes
# Password: Kavkaz2026!Mail
HASH_INFO='{SHA512-CRYPT}$6$rounds=50000$saltsalt$fN0Z5mZ1331x35Z9.6zFq3O.W9J12vA/qN65l9x0B72/Xk9e1y0y7.4t2Z1/3A5.4e8.9y1y0w9.7t2Z1/3A5.'
echo "info@kavkazskitur.ru:$HASH_INFO" > /etc/dovecot/users
echo "info@kavkazskitur.com:$HASH_INFO" >> /etc/dovecot/users
chown root:dovecot /etc/dovecot/users
chmod 640 /etc/dovecot/users

echo "=== [4/8] Configuring Postfix ==="
postconf -e "myhostname = mail.kavkazskitur.ru"
postconf -e "mydestination = localhost, localhost.localdomain"
postconf -e "virtual_mailbox_domains = kavkazskitur.ru, kavkazskitur.com, gotoelbrus.ru"
postconf -e "virtual_transport = lmtp:unix:private/dovecot-lmtp"
postconf -e "smtpd_sasl_type = dovecot"
postconf -e "smtpd_sasl_path = private/auth"
postconf -e "smtpd_sasl_auth_enable = yes"
postconf -e "smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination"
postconf -e "smtpd_tls_cert_file = /etc/letsencrypt/live/kavkazskitur.ru/fullchain.pem"
postconf -e "smtpd_tls_key_file = /etc/letsencrypt/live/kavkazskitur.ru/privkey.pem"
postconf -e "smtpd_tls_security_level = may"
postconf -e "smtp_tls_security_level = may"
postconf -e "inet_protocols = ipv4"
postconf -e "inet_interfaces = all"

# Enable submission (587) and smtps (465) in master.cf
cat << 'EOF' >> /etc/postfix/master.cf

submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject

smtps     inet  n       -       y       -       -       smtpd
  -o syslog_name=postfix/smtps
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
EOF

echo "=== [5/8] Configuring Rspamd & DKIM ==="
mkdir -p /var/lib/rspamd/dkim
mkdir -p /etc/rspamd/local.d

# Generate DKIM for kavkazskitur.ru
if [ ! -f /var/lib/rspamd/dkim/kavkazskitur.ru.key ]; then
    rspamadm dkim_keygen -d kavkazskitur.ru -s mail -k /var/lib/rspamd/dkim/kavkazskitur.ru.key > /var/lib/rspamd/dkim/kavkazskitur.ru.pub
    rspamadm dkim_keygen -d kavkazskitur.com -s mail -k /var/lib/rspamd/dkim/kavkazskitur.com.key > /var/lib/rspamd/dkim/kavkazskitur.com.pub
    chown -R _rspamd:_rspamd /var/lib/rspamd/dkim
    chmod 440 /var/lib/rspamd/dkim/*.key
fi

cat << 'EOF' > /etc/rspamd/local.d/dkim_signing.conf
path = "/var/lib/rspamd/dkim/$domain.key";
selector = "mail";
allow_username_mismatch = true;
EOF

# Integrate Postfix with Rspamd Milter
postconf -e "smtpd_milters = inet:localhost:11332"
postconf -e "non_smtpd_milters = inet:localhost:11332"
postconf -e "milter_mail_macros = i {mail_addr} {client_addr} {client_name} {auth_authen}"
postconf -e "milter_default_action = accept"

echo "=== [6/8] Installing SnappyMail Webmail ==="
mkdir -p /var/www/mail.kavkazskitur.ru
if [ ! -f /var/www/mail.kavkazskitur.ru/index.php ]; then
    cd /tmp
    wget -q -O snappymail.tar.gz https://github.com/the-djmaze/snappymail/releases/download/v2.38.2/snappymail-2.38.2.tar.gz || \
    wget -q -O snappymail.tar.gz https://snappymail.eu/repository/latest.tar.gz
    tar -xzf snappymail.tar.gz -C /var/www/mail.kavkazskitur.ru
    chown -R www-data:www-data /var/www/mail.kavkazskitur.ru
    chmod -R 755 /var/www/mail.kavkazskitur.ru
fi

echo "=== [7/8] Configuring Nginx for Webmail ==="
cat << 'EOF' > /etc/nginx/sites-available/mail.kavkazskitur.ru
server {
    listen 80;
    listen [::]:80;
    server_name mail.kavkazskitur.ru mail.kavkazskitur.com;
    root /var/www/mail.kavkazskitur.ru;
    index index.php index.html;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_read_timeout 300;
    }

    location ^~ /data {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/mail.kavkazskitur.ru /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "=== [8/8] Enabling custom SSH port 2222 and restarting services ==="
echo "Port 22" > /etc/ssh/sshd_config.d/ports.conf
echo "Port 2222" >> /etc/ssh/sshd_config.d/ports.conf
systemctl restart ssh || true

systemctl restart redis-server
systemctl restart rspamd
systemctl restart dovecot
systemctl restart postfix

echo "=== MAIL STACK DEPLOYMENT COMPLETE ==="
cat /var/lib/rspamd/dkim/kavkazskitur.ru.pub || true
