import sys
import paramiko

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', username='root', password='qCQFo9AD56Tq')

commands = [
    "sed -i 's/^short_open_tag = Off/short_open_tag = On/' /etc/php/7.4/fpm/php.ini",
    "sed -i 's/^short_open_tag = Off/short_open_tag = On/' /etc/php/7.4/cli/php.ini",
    "sed -i 's/^memory_limit = .*/memory_limit = 512M/' /etc/php/7.4/fpm/php.ini",
    "sed -i 's/^max_execution_time = .*/max_execution_time = 300/' /etc/php/7.4/fpm/php.ini",
    "sed -i 's/^upload_max_filesize = .*/upload_max_filesize = 128M/' /etc/php/7.4/fpm/php.ini",
    "sed -i 's/^post_max_size = .*/post_max_size = 128M/' /etc/php/7.4/fpm/php.ini",
    "systemctl restart php7.4-fpm",
    "php7.4 -i | grep short_open_tag",
    "grep '^short_open_tag' /etc/php/7.4/fpm/php.ini",
    "grep '^memory_limit' /etc/php/7.4/fpm/php.ini"
]

for cmd in commands:
    print(f">> {cmd}")
    _, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        print(out)
    if err:
        print(f"[ERR] {err}")

ssh.close()
print("PHP 7.4 configuration updated and php7.4-fpm restarted.")
