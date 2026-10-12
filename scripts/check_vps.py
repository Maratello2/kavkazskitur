import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', username='root', password='qCQFo9AD56Tq')

def run(c):
    _, out, err = ssh.exec_command(c)
    return out.read().decode('utf-8', errors='replace')

print('=== NGINX kavkazskitur.ru ===')
print(run('cat /etc/nginx/sites-available/kavkazskitur.ru'))

print('=== NGINX kavkazskitur.com ===')
print(run('cat /etc/nginx/sites-available/kavkazskitur.com'))

print('=== NGINX default ===')
print(run('cat /etc/nginx/sites-available/default'))

print('=== MYSQL DATABASES ===')
print(run("mysql -e 'SHOW DATABASES;'"))

print('=== cms_wp_options IN c19596_db2 ===')
print(run("mysql -e 'SELECT option_name, option_value FROM c19596_db2.cms_wp_options WHERE option_name IN (\"siteurl\", \"home\", \"blogname\");' 2>/dev/null"))

print('=== WP CONFIG kavkazskitur.com ===')
print(run("grep -E 'DB_NAME|DB_USER' /var/www/kavkazskitur.com/wp-config.php 2>/dev/null"))

print('=== WP CONFIG kavkazskitur.ru ===')
print(run("grep -E 'DB_NAME|DB_USER' /var/www/kavkazskitur.ru/wp-config.php 2>/dev/null"))

print('=== CHECK ALL WP-CONFIG ON SERVER ===')
print(run("find /var/www -name 'wp-config.php' 2>/dev/null"))


ssh.close()
