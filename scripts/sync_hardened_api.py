import os
import sys
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

VPS_HOST = "161.104.35.24"
VPS_USER = "root"
VPS_PASS = "qCQFo9AD56Tq"

# PHP handlers to upload directly
FILES_TO_SYNC = [
    (r"d:\Desktop\kavkazskitur\scripts\leads.php", "/var/www/gotoelbrus.ru/api/leads.php"),
    (r"d:\Desktop\kavkazskitur\public\api\admin_settings.php", "/var/www/gotoelbrus.ru/api/admin_settings.php"),
    (r"d:\Desktop\kavkazskitur\public\api\admin_tours.php", "/var/www/gotoelbrus.ru/api/admin_tours.php"),
    (r"d:\Desktop\kavkazskitur\public\api\admin_categories.php", "/var/www/gotoelbrus.ru/api/admin_categories.php"),
    (r"d:\Desktop\kavkazskitur\public\api\admin_upload.php", "/var/www/gotoelbrus.ru/api/admin_upload.php")
]

# We also generate admin_leads, admin_login, admin_users from our updated templates
from build_export import ADMIN_LOGIN_PHP, ADMIN_LEADS_PHP, ADMIN_USERS_PHP

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS, timeout=30)
sftp = ssh.open_sftp()

for local_path, remote_path in FILES_TO_SYNC:
    print(f"Uploading {local_path} -> {remote_path}...")
    sftp.put(local_path, remote_path)

with sftp.file("/var/www/gotoelbrus.ru/api/admin_login.php", "w") as f:
    f.write(ADMIN_LOGIN_PHP)
print("Uploaded /var/www/gotoelbrus.ru/api/admin_login.php")

with sftp.file("/var/www/gotoelbrus.ru/api/admin_leads.php", "w") as f:
    f.write(ADMIN_LEADS_PHP)
print("Uploaded /var/www/gotoelbrus.ru/api/admin_leads.php")

with sftp.file("/var/www/gotoelbrus.ru/api/admin_users.php", "w") as f:
    f.write(ADMIN_USERS_PHP)
print("Uploaded /var/www/gotoelbrus.ru/api/admin_users.php")

sftp.close()

# Set permissions
ssh.exec_command("chown -R www-data:www-data /var/www/gotoelbrus.ru/api && chmod -R 644 /var/www/gotoelbrus.ru/api/*.php && chmod 755 /var/www/gotoelbrus.ru/api")
ssh.exec_command("systemctl reload php8.3-fpm")
ssh.close()
print("All hardened API handlers synced to VPS successfully!")
