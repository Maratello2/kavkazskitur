import imaplib
import smtplib
import ssl

print("--- Testing IMAP SSL on mail.kavkazskitur.ru:993 ---")
try:
    context = ssl.create_default_context()
    mail = imaplib.IMAP4_SSL('mail.kavkazskitur.ru', 993, ssl_context=context)
    print("IMAP SSL connection OK!")
    print("Capabilities:", mail.capabilities)
    typ, data = mail.login('info@kavkazskitur.ru', 'Kavkaz2026!Mail')
    print("IMAP Login Result:", typ, data)
    mail.select('INBOX')
    typ, msg_count = mail.search(None, 'ALL')
    print("Messages in INBOX:", len(msg_count[0].split()) if msg_count[0] else 0)
    mail.logout()
except Exception as e:
    print("IMAP SSL Error:", type(e), e)

print("\n--- Testing SMTP SSL on mail.kavkazskitur.ru:465 ---")
try:
    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL('mail.kavkazskitur.ru', 465, context=context, timeout=10)
    print("SMTP SSL connection OK!")
    server.login('info@kavkazskitur.ru', 'Kavkaz2026!Mail')
    print("SMTP Login Result: SUCCESS!")
    server.quit()
except Exception as e:
    print("SMTP SSL Error:", type(e), e)

print("\n--- Testing SMTP STARTTLS on mail.kavkazskitur.ru:587 ---")
try:
    server = smtplib.SMTP('mail.kavkazskitur.ru', 587, timeout=10)
    server.starttls(context=context)
    print("SMTP STARTTLS connection OK!")
    server.login('info@kavkazskitur.ru', 'Kavkaz2026!Mail')
    print("SMTP STARTTLS Login Result: SUCCESS!")
    server.quit()
except Exception as e:
    print("SMTP STARTTLS Error:", type(e), e)
