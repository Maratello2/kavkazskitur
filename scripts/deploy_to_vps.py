#!/usr/bin/env python3
import os
import sys
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

VPS_HOST = "161.104.35.24"
VPS_USER = "root"
VPS_PASS = "qCQFo9AD56Tq"
LOCAL_ARCHIVE = r"d:\Desktop\kavkazskitur\prod_deploy.tar.gz"

# 1. NEW Next.js English site on kavkazskitur.com
NGINX_KAVKAZSKITUR_COM = """# KavKazSkiTur New English Site (Next.js + PHP 8.3-FPM API)
server {
    listen 80;
    listen [::]:80;
    server_name kavkazskitur.com www.kavkazskitur.com;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/kavkazskitur.com;
        default_type "text/plain";
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kavkazskitur.com www.kavkazskitur.com;
    root /var/www/kavkazskitur.com;
    index index.html index.php;

    client_max_body_size 64M;

    # SSL Configuration (Let's Encrypt Certificate)
    ssl_certificate /etc/letsencrypt/live/kavkazskitur.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kavkazskitur.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;

    # High-Performance Compression & Static Gzip
    gzip on;
    gzip_static on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml
        application/xml+rss
        image/svg+xml
        image/x-icon
        application/vnd.ms-fontobject
        font/eot
        font/opentype
        font/otf
        application/x-font-ttf
        application/font-woff
        application/font-woff2
        font/woff
        font/woff2;

    # Security & Modern Best Practices Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # ACME Challenge for Let's Encrypt renewal
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/kavkazskitur.com;
        default_type "text/plain";
        allow all;
    }

    # Clean URLs & Next.js static pages
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Public API routing to PHP 8.3-FPM
    location ~ ^/api/(leads|lead|booking|contact|settings|tours|categories) {
        rewrite ^/api/leads/?$ /api/leads.php break;
        rewrite ^/api/lead/?$ /api/leads.php break;
        rewrite ^/api/booking/?$ /api/leads.php break;
        rewrite ^/api/contact/?$ /api/leads.php break;
        rewrite ^/api/settings/?$ /api/settings.php break;
        rewrite ^/api/tours/?$ /api/tours.php break;
        rewrite ^/api/categories/?$ /api/categories.php break;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Admin API routing to PHP 8.3-FPM
    location ~ ^/api/admin/(login|auth|logout|leads|settings|users|tours|categories|upload) {
        rewrite ^/api/admin/login/?$ /api/admin_login.php break;
        rewrite ^/api/admin/auth/?$ /api/admin_auth.php break;
        rewrite ^/api/admin/logout/?$ /api/admin_auth.php break;
        rewrite ^/api/admin/leads/?$ /api/admin_leads.php break;
        rewrite ^/api/admin/settings/?$ /api/admin_settings.php break;
        rewrite ^/api/admin/users/?$ /api/admin_users.php break;
        rewrite ^/api/admin/tours/?$ /api/admin_tours.php break;
        rewrite ^/api/admin/categories/?$ /api/admin_categories.php break;
        rewrite ^/api/admin/upload/?$ /api/admin_upload.php break;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # General PHP execution
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Protect internal data and environment
    location ~ ^/(data/|\.env) {
        deny all;
    }

    # Static CSS & JS with gzip_static and immutable cache
    location ~* \.(js|css)$ {
        gzip_static on;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Content-Type-Options "nosniff" always;
        add_header Access-Control-Allow-Origin "*";
        try_files $uri =404;
    }

    # Static Media & Fonts with immutable cache
    location ~* \.(webp|png|jpg|jpeg|svg|woff2|woff|ico|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Content-Type-Options "nosniff" always;
        add_header Access-Control-Allow-Origin "*";
        try_files $uri =404;
    }
}
"""

# 2. OLD Russian WordPress site on kavkazskitur.ru
NGINX_KAVKAZSKITUR_RU = """# KavKazSkiTur Old Russian Site (WordPress + PHP 7.4-FPM)
server {
    listen 80;
    listen [::]:80;
    server_name kavkazskitur.ru www.kavkazskitur.ru;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/kavkazskitur.ru;
        default_type "text/plain";
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kavkazskitur.ru www.kavkazskitur.ru;
    root /var/www/kavkazskitur.ru;
    index index.php index.html;

    client_max_body_size 128M;

    # SSL Configuration (Let's Encrypt Certificate)
    ssl_certificate /etc/letsencrypt/live/kavkazskitur.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kavkazskitur.ru/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/kavkazskitur.ru;
        default_type "text/plain";
        allow all;
    }

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS on;
        fastcgi_read_timeout 300;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2|woff)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri /index.php?$args;
    }

    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt { log_not_found off; access_log off; allow all; }
    location ~ /\. { deny all; }
    location ~* /(?:uploads|files)/.*\.php$ { deny all; }
}
"""

# 3. 301 Redirect gotoelbrus.ru -> https://kavkazskitur.ru
NGINX_GOTOELBRUS = """# Redirect gotoelbrus.ru to old Russian site kavkazskitur.ru
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gotoelbrus.ru www.gotoelbrus.ru;

    ssl_certificate /etc/letsencrypt/live/gotoelbrus.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gotoelbrus.ru/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/gotoelbrus.ru;
        default_type "text/plain";
        allow all;
    }

    location / {
        return 301 https://kavkazskitur.ru$request_uri;
    }
}
"""

# 4. Barrels Refuge WordPress site on elbrus-barrels.com & elbrus-garabashi.ru
NGINX_ELBRUS_BARRELS = """# Elbrus Barrels Refuge Site (WordPress + PHP 7.4-FPM)
server {
    listen 80;
    listen [::]:80;
    server_name elbrus-barrels.com www.elbrus-barrels.com elbrus-garabashi.ru www.elbrus-garabashi.ru;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/elbrus-barrels.com;
        default_type "text/plain";
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name elbrus-barrels.com www.elbrus-barrels.com elbrus-garabashi.ru www.elbrus-garabashi.ru;
    root /var/www/elbrus-barrels.com;
    index index.php index.html;

    client_max_body_size 128M;

    # SSL Configuration (Let's Encrypt Certificate)
    ssl_certificate /etc/letsencrypt/live/elbrus-barrels.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elbrus-barrels.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/elbrus-barrels.com;
        default_type "text/plain";
        allow all;
    }

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS on;
        fastcgi_read_timeout 300;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2|woff)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri /index.php?$args;
    }

    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt { log_not_found off; access_log off; allow all; }
    location ~ /\. { deny all; }
    location ~* /(?:uploads|files)/.*\.php$ { deny all; }
}
"""

def run_remote(ssh, cmd):
    print(f">> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out:
        print(out.strip())
    if err:
        print(f"[ERR] {err.strip()}")
    return out, err

def main():
    if not os.path.exists(LOCAL_ARCHIVE):
        print(f"Error: {LOCAL_ARCHIVE} not found. Run scripts/build_export.py first.")
        sys.exit(1)

    print(f"=== Connecting to VPS {VPS_HOST} ===")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS, timeout=30)
    print("SSH connection established.")

    # 1. Update WordPress DB URLs to HTTPS to prevent redirect loops
    print("\n--- Updating WordPress DB URLs to HTTPS ---")
    run_remote(ssh, "mysql -e \"UPDATE c19596_kst.wp_options SET option_value='https://kavkazskitur.ru' WHERE option_name IN ('siteurl', 'home');\"")
    run_remote(ssh, "mysql -e \"UPDATE c19596_s4.cms_wp_options SET option_value='https://elbrus-barrels.com' WHERE option_name IN ('siteurl', 'home');\"")

    # 2. Update Nginx configuration files
    print("\n--- Updating Nginx configuration files for all sites ---")
    sftp = ssh.open_sftp()
    
    with sftp.file("/etc/nginx/sites-available/kavkazskitur.com", "w") as f:
        f.write(NGINX_KAVKAZSKITUR_COM)
    print("Updated /etc/nginx/sites-available/kavkazskitur.com")

    with sftp.file("/etc/nginx/sites-available/kavkazskitur.ru", "w") as f:
        f.write(NGINX_KAVKAZSKITUR_RU)
    print("Updated /etc/nginx/sites-available/kavkazskitur.ru")

    with sftp.file("/etc/nginx/sites-available/gotoelbrus.ru", "w") as f:
        f.write(NGINX_GOTOELBRUS)
    print("Updated /etc/nginx/sites-available/gotoelbrus.ru")

    with sftp.file("/etc/nginx/sites-available/elbrus-barrels.com", "w") as f:
        f.write(NGINX_ELBRUS_BARRELS)
    print("Updated /etc/nginx/sites-available/elbrus-barrels.com")

    # Ensure symlinks in sites-enabled
    for site in ["kavkazskitur.com", "kavkazskitur.ru", "gotoelbrus.ru", "elbrus-barrels.com"]:
        run_remote(ssh, f"ln -sf /etc/nginx/sites-available/{site} /etc/nginx/sites-enabled/{site}")

    # Remove default site if present
    run_remote(ssh, "rm -f /etc/nginx/sites-enabled/default")

    # Test and reload Nginx
    run_remote(ssh, "nginx -t && systemctl reload nginx")

    # 3. Backup original kavkazskitur.com if not already backed up
    print("\n--- Backing up original kavkazskitur.com ---")
    run_remote(ssh, "if [ ! -d /var/www/kavkazskitur.com.backup_wp ]; then cp -a /var/www/kavkazskitur.com /var/www/kavkazskitur.com.backup_wp; echo 'Backup created'; else echo 'Backup already exists'; fi")

    # 4. Upload prod_deploy.tar.gz
    sz_mb = round(os.path.getsize(LOCAL_ARCHIVE) / (1024 * 1024), 2)
    print(f"\n--- Uploading {LOCAL_ARCHIVE} ({sz_mb} MB) to /tmp/prod_deploy.tar.gz ---")
    sftp.put(LOCAL_ARCHIVE, "/tmp/prod_deploy.tar.gz")
    print("Upload completed.")
    sftp.close()

    # 5. Extract to /var/www/kavkazskitur.com
    print("\n--- Deploying new site files to /var/www/kavkazskitur.com ---")
    run_remote(ssh, "mkdir -p /var/www/kavkazskitur.com/uploads /var/www/kavkazskitur.com/data")
    run_remote(ssh, "tar -xzf /tmp/prod_deploy.tar.gz -C /var/www/kavkazskitur.com/")
    run_remote(ssh, "rm -f /tmp/prod_deploy.tar.gz")

    # 6. Ensure wp-content symlink to media backup
    print("\n--- Ensuring wp-content media symlink ---")
    run_remote(ssh, "if [ ! -L /var/www/kavkazskitur.com/wp-content ]; then if [ ! -d /var/www/kavkazskitur.com/wp-content ]; then ln -s /var/www/kavkazskitur.com.backup_wp/wp-content /var/www/kavkazskitur.com/wp-content; fi; fi")
    run_remote(ssh, "ls -ld /var/www/kavkazskitur.com/wp-content")

    # 7. Set .env with admin email notifications
    print("\n--- Setting .env for KavKazSkiTur ---")
    env_content = "ADMIN_NOTIFICATION_EMAIL=info@kavkazskitur.com,info@kavkazskitur.ru\\n"
    run_remote(ssh, f"echo -e '{env_content}' > /var/www/kavkazskitur.com/.env")

    # 8. Fix file permissions
    print("\n--- Fixing file permissions ---")
    run_remote(ssh, "chmod -R 775 /var/www/kavkazskitur.com/data /var/www/kavkazskitur.com/uploads")
    run_remote(ssh, "chown -R www-data:www-data /var/www/kavkazskitur.com")

    # 9. Reload services
    print("\n--- Reloading Nginx & PHP Services ---")
    run_remote(ssh, "systemctl reload nginx")
    run_remote(ssh, "systemctl reload php8.3-fpm")
    run_remote(ssh, "systemctl reload php7.4-fpm")

    # 10. Verification Health Checks
    print("\n--- Verification Health Checks ---")
    run_remote(ssh, "curl -s -k -o /dev/null -w 'HTTPS kavkazskitur.com: %{http_code}\\n' https://kavkazskitur.com/")
    run_remote(ssh, "curl -s -k -o /dev/null -w 'HTTPS kavkazskitur.ru: %{http_code}\\n' https://kavkazskitur.ru/")
    run_remote(ssh, "curl -s -k -o /dev/null -w 'HTTPS gotoelbrus.ru (redirect): %{http_code}\\n' https://gotoelbrus.ru/")
    run_remote(ssh, "curl -s -k -o /dev/null -w 'HTTPS elbrus-barrels.com: %{http_code}\\n' https://elbrus-barrels.com/")
    run_remote(ssh, "curl -s -k -o /dev/null -w 'HTTP API Tours: %{http_code}\\n' https://kavkazskitur.com/api/tours")
    run_remote(ssh, "curl -s -k -o /dev/null -w 'HTTP API Settings: %{http_code}\\n' https://kavkazskitur.com/api/settings")

    ssh.close()
    print("\n=== Deployment to VPS successfully finished! ===")

if __name__ == "__main__":
    main()
