import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
for userdir in /var/mail/vhosts/kavkazskitur.ru/info /var/mail/vhosts/kavkazskitur.com/info; do
    mkdir -p "$userdir/Junk/cur" "$userdir/Junk/new" "$userdir/Junk/tmp"
    chown -R vmail:vmail "$userdir/Junk"
    for dir in "$userdir/cur" "$userdir/new"; do
        [ -d "$dir" ] || continue
        find "$dir" -type f -exec grep -l "X-Spam: Yes" {} + 2>/dev/null | while read f; do
            echo "Moving spam $f to Junk/cur/"
            mv "$f" "$userdir/Junk/cur/"
        done
    done
done
echo "Done moving existing spam."
"""

_, out, _ = ssh.exec_command(cmd)
print(out.read().decode())
ssh.close()
