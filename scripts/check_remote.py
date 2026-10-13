import sys
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', username='root', password='qCQFo9AD56Tq')

for cmd in [
    'ls -la /var/www/kavkazskitur.com.backup_wp | head -n 20',
    'grep -E "DB_NAME|table_prefix" /var/www/kavkazskitur.com.backup_wp/wp-config.php',
    "mysql -e \"SELECT option_name, option_value FROM c19596_db2.cms_wp_options WHERE option_name IN ('siteurl', 'home');\"",
    "mysql -e \"SELECT option_name, option_value FROM c19596_kst.wp_options WHERE option_name IN ('siteurl', 'home');\"",
    "mysql -e \"SELECT option_name, option_value FROM c19596_s4.cms_wp_options WHERE option_name IN ('siteurl', 'home');\"",
    'ls -la /var/www/gotoelbrus.ru | head -n 20'
]:
    print(f"=== {cmd}")
    _, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode('utf-8', errors='replace'))
    err = stderr.read().decode('utf-8', errors='replace')
    if err:
        print("[ERR]", err)

ssh.close()
