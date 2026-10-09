#!/usr/bin/env python3
import os
import subprocess

GOTOELBRUS = """server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name gotoelbrus.ru www.gotoelbrus.ru 161.104.35.24;
    root /var/www/gotoelbrus.ru;
    index index.html index.php;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    location ~ ^/api/(leads|lead|booking|contact) {
        try_files /api/leads.php =404;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root/api/leads.php;
    }

    location ~ ^/api/admin/(login|auth|logout|leads|settings|users) {
        rewrite ^/api/admin/login/?$ /api/admin_login.php break;
        rewrite ^/api/admin/auth/?$ /api/admin_auth.php break;
        rewrite ^/api/admin/logout/?$ /api/admin_auth.php break;
        rewrite ^/api/admin/leads/?$ /api/admin_leads.php break;
        rewrite ^/api/admin/settings/?$ /api/admin_settings.php break;
        rewrite ^/api/admin/users/?$ /api/admin_users.php break;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ \\.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ ^/(data/|\\.env) {
        deny all;
    }

    location ~* \\.(js|css|webp|png|jpg|jpeg|svg|woff2|woff|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
"""

KAVKAZSKITUR_COM = """server {
    listen 80;
    listen [::]:80;
    server_name kavkazskitur.com www.kavkazskitur.com;
    root /var/www/kavkazskitur.com;
    index index.php index.html;

    client_max_body_size 128M;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \\.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_read_timeout 300;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2|woff)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri /index.php?$args;
    }

    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt { log_not_found off; access_log off; allow all; }
    location ~ /\\. { deny all; }
    location ~* /(?:uploads|files)/.*\\.php$ { deny all; }
}
"""

KAVKAZSKITUR_RU = """server {
    listen 80;
    listen [::]:80;
    server_name kavkazskitur.ru www.kavkazskitur.ru;
    root /var/www/kavkazskitur.ru;
    index index.php index.html;

    client_max_body_size 128M;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \\.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_read_timeout 300;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2|woff)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri /index.php?$args;
    }

    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt { log_not_found off; access_log off; allow all; }
    location ~ /\\. { deny all; }
    location ~* /(?:uploads|files)/.*\\.php$ { deny all; }
}
"""

with open("/etc/nginx/sites-available/gotoelbrus.ru", "w", encoding="utf-8") as f:
    f.write(GOTOELBRUS)

with open("/etc/nginx/sites-available/kavkazskitur.com", "w", encoding="utf-8") as f:
    f.write(KAVKAZSKITUR_COM)

with open("/etc/nginx/sites-available/kavkazskitur.ru", "w", encoding="utf-8") as f:
    f.write(KAVKAZSKITUR_RU)

for site in ["gotoelbrus.ru", "kavkazskitur.com", "kavkazskitur.ru"]:
    target = f"/etc/nginx/sites-enabled/{site}"
    src = f"/etc/nginx/sites-available/{site}"
    if not os.path.exists(target):
        os.symlink(src, target)

if os.path.exists("/etc/nginx/sites-enabled/default"):
    os.remove("/etc/nginx/sites-enabled/default")

print("Nginx configurations written successfully.")
