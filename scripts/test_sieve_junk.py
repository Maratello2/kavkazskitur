import smtplib
import ssl
from email.mime.text import MIMEText

msg = MIMEText('This is a test email with X-Spam: Yes header to verify Dovecot Sieve rules.')
msg['Subject'] = 'Spam Sieve Routing Test'
msg['From'] = 'info@kavkazskitur.ru'
msg['To'] = 'info@kavkazskitur.ru'
msg['X-Spam'] = 'Yes'

ctx = ssl.create_default_context()
s = smtplib.SMTP_SSL('mail.kavkazskitur.ru', 465, context=ctx)
s.login('info@kavkazskitur.ru', 'Kavkaz2026!Mail')
s.sendmail('info@kavkazskitur.ru', ['info@kavkazskitur.ru'], msg.as_string())
s.quit()
print("Sent test spam email successfully via port 465!")
