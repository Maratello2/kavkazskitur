#!/usr/bin/env python3
import paramiko
import sys
import time

VPS_HOST = "161.104.35.24"
VPS_USER = "root"
VPS_PASS = "qCQFo9AD56Tq"

NGINX_BARRELS = """server {
    listen 80;
    listen [::]:80;
    server_name elbrus-barrels.com www.elbrus-barrels.com;
    root /var/www/elbrus-barrels.com;
    index index.php index.html;

    client_max_body_size 128M;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
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

def main():
    print("=== Connecting to VPS ===")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS, timeout=30)

    def run(cmd):
        print(f">> {cmd}")
        _, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        if out: print(out.strip())
        if err: print(f"[ERR] {err.strip()}")
        return out

    # 1. Transfer files and SQL from old host to VPS /tmp
    print("\n--- 1. Fetching files and database dump from old host ---")
    ssh_opts = "-o StrictHostKeyChecking=no -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa"
    run(f"sshpass -p '6xsHNpN:' scp {ssh_opts} c19596@ssh.c19596.nichost.ru:/home/c19596/elbrus_barrels_files.tar.gz /tmp/")
    run(f"sshpass -p '6xsHNpN:' scp {ssh_opts} c19596@ssh.c19596.nichost.ru:/home/c19596/elbrus_barrels_dump.sql /tmp/")
    run("ls -lh /tmp/elbrus_barrels*")

    # 2. Create MySQL database and user on VPS
    print("\n--- 2. Setting up MySQL database c19596_s4 ---")
    run("mysql -e 'CREATE DATABASE IF NOT EXISTS c19596_s4 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'")
    run("mysql -e \"CREATE USER IF NOT EXISTS 'c19596_u4'@'localhost' IDENTIFIED BY 'mnBOutDf1f';\"")
    run("mysql -e \"GRANT ALL PRIVILEGES ON c19596_s4.* TO 'c19596_u4'@'localhost'; FLUSH PRIVILEGES;\"")
    print("Importing database dump...")
    run("mysql c19596_s4 < /tmp/elbrus_barrels_dump.sql")
    run("mysql -e 'SELECT count(*) FROM c19596_s4.cms_wp_posts;'")

    # 3. Extract files to /var/www/elbrus-barrels.com
    print("\n--- 3. Extracting website files to /var/www/elbrus-barrels.com ---")
    run("mkdir -p /var/www/elbrus-barrels.com")
    run("tar -xzf /tmp/elbrus_barrels_files.tar.gz -C /var/www/elbrus-barrels.com/")
    run("chown -R www-data:www-data /var/www/elbrus-barrels.com")
    run("chmod -R 755 /var/www/elbrus-barrels.com")
    run("ls -la /var/www/elbrus-barrels.com | head -n 15")

    # 4. Check wp-config.php on VPS
    print("\n--- 4. Checking wp-config.php ---")
    run("grep -E 'DB_NAME|DB_USER|DB_PASSWORD|DB_HOST' /var/www/elbrus-barrels.com/wp-config.php")

    # 5. Set up Nginx for elbrus-barrels.com
    print("\n--- 5. Configuring Nginx for elbrus-barrels.com ---")
    sftp = ssh.open_sftp()
    with sftp.file("/etc/nginx/sites-available/elbrus-barrels.com", "w") as f:
        f.write(NGINX_BARRELS)
    sftp.close()

    run("ln -sf /etc/nginx/sites-available/elbrus-barrels.com /etc/nginx/sites-enabled/elbrus-barrels.com")
    run("nginx -t && systemctl reload nginx")

    # 6. Verify via curl on VPS
    print("\n--- 6. Verifying elbrus-barrels.com ---")
    run("curl -s -o /dev/null -w 'HTTP Host elbrus-barrels.com: %{http_code}\\n' -H 'Host: elbrus-barrels.com' http://127.0.0.1/")
    run("curl -s -I -H 'Host: elbrus-barrels.com' http://127.0.0.1/ | head -n 8")

    ssh.close()
    print("\n=== Elbrus Barrels site restored successfully! ===")

if __name__ == "__main__":
    main()
