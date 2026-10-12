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

NGINX_GOTOELBRUS = """server {
    listen 80;
    listen [::]:80;
    server_name gotoelbrus.ru www.gotoelbrus.ru 161.104.35.24;
    root /var/www/gotoelbrus.ru;
    index index.html index.php;

    client_max_body_size 64M;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

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

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ ^/(data/|\.env) {
        deny all;
    }

    location ~* \.(js|css|webp|png|jpg|jpeg|svg|woff2|woff|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
"""

def run_remote(ssh, cmd):
    print(f">> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8')
    err = stderr.read().decode('utf-8')
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

    # 1. Update Nginx configuration
    print("\n--- Updating Nginx configuration on VPS ---")
    sftp = ssh.open_sftp()
    with sftp.file("/etc/nginx/sites-available/gotoelbrus.ru", "w") as f:
        f.write(NGINX_GOTOELBRUS)
    print("Updated /etc/nginx/sites-available/gotoelbrus.ru")

    run_remote(ssh, "nginx -t && systemctl reload nginx")

    # 2. Upload prod_deploy.tar.gz
    sz_mb = round(os.path.getsize(LOCAL_ARCHIVE) / (1024 * 1024), 2)
    print(f"\n--- Uploading {LOCAL_ARCHIVE} ({sz_mb} MB) to /tmp/prod_deploy.tar.gz ---")
    sftp.put(LOCAL_ARCHIVE, "/tmp/prod_deploy.tar.gz")
    print("Upload completed.")
    sftp.close()

    # 3. Extract to /var/www/gotoelbrus.ru
    print("\n--- Deploying files on VPS ---")
    run_remote(ssh, "mkdir -p /var/www/gotoelbrus.ru/uploads")
    run_remote(ssh, "tar -xzf /tmp/prod_deploy.tar.gz -C /var/www/gotoelbrus.ru/")
    run_remote(ssh, "rm -f /tmp/prod_deploy.tar.gz")

    # 4. Ensure wp-content symlink to original media
    print("\n--- Ensuring media symlink to original WP uploads ---")
    run_remote(ssh, "if [ ! -L /var/www/gotoelbrus.ru/wp-content ]; then rm -rf /var/www/gotoelbrus.ru/wp-content && ln -s /var/www/kavkazskitur.com/wp-content /var/www/gotoelbrus.ru/wp-content; fi")
    run_remote(ssh, "ls -ld /var/www/gotoelbrus.ru/wp-content")

    # 5. Fix permissions
    print("\n--- Fixing file permissions ---")
    run_remote(ssh, "chmod -R 775 /var/www/gotoelbrus.ru/data /var/www/gotoelbrus.ru/uploads")
    run_remote(ssh, "chown -R www-data:www-data /var/www/gotoelbrus.ru")

    # 6. Verify PHP-FPM socket and Nginx
    print("\n--- Verifying Services ---")
    run_remote(ssh, "systemctl status php8.3-fpm --no-pager | head -n 3")
    run_remote(ssh, "systemctl reload nginx")

    # 7. Verification HTTP curl checks locally on server
    print("\n--- Verification Health Checks ---")
    run_remote(ssh, "curl -s -o /dev/null -w 'HTTP Homepage: %{http_code}\\n' http://localhost/")
    run_remote(ssh, "curl -s -o /dev/null -w 'HTTP Expeditions: %{http_code}\\n' http://localhost/expeditions")
    run_remote(ssh, "curl -s -o /dev/null -w 'HTTP Admin: %{http_code}\\n' http://localhost/admin")
    run_remote(ssh, "curl -s -o /dev/null -w 'HTTP API Categories: %{http_code}\\n' http://localhost/api/categories")
    run_remote(ssh, "curl -s -o /dev/null -w 'HTTP API Tours: %{http_code}\\n' http://localhost/api/tours")
    run_remote(ssh, "curl -s -I http://localhost/wp-content/uploads/2015/07/IMG_9577.jpg | head -n 4")

    ssh.close()
    print("\n=== Deployment to VPS successfully finished! ===")

if __name__ == "__main__":
    main()
