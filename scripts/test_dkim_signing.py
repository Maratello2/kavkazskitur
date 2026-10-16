import smtplib
import ssl
from email.mime.text import MIMEText
import paramiko
import time

msg = MIMEText('Testing DKIM signature generation on outbound mail from kavkazskitur.ru.')
msg['Subject'] = 'DKIM Outbound Signature Verification'
msg['From'] = 'info@kavkazskitur.ru'
msg['To'] = 'info@kavkazskitur.com'

ctx = ssl.create_default_context()
s = smtplib.SMTP_SSL('mail.kavkazskitur.ru', 465, context=ctx)
s.login('info@kavkazskitur.ru', 'Kavkaz2026!Mail')
s.sendmail('info@kavkazskitur.ru', ['info@kavkazskitur.com'], msg.as_string())
s.quit()
print("Message sent via SMTPS 465!")

time.sleep(2)

# Check the message delivered to info@kavkazskitur.com
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

cmd = """
latest=$(ls -t /var/mail/vhosts/kavkazskitur.com/info/new/* 2>/dev/null | head -n 1)
if [ -n "$latest" ]; then
    echo "=== Headers of $latest ==="
    grep -E '^(DKIM-Signature|Authentication-Results|Received-SPF|X-Spam|From|To|Subject):' "$latest"
else
    echo "No new message found"
fi
"""
_, out, _ = ssh.exec_command(cmd)
print(out.read().decode())
ssh.close()
