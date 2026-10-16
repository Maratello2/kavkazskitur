import paramiko
import json
import dns.resolver

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

_, out, _ = ssh.exec_command('cat /var/lib/rspamd/dkim/kavkazskitur.ru.pub')
ru_pub = out.read().decode().strip()
print("Rspamd DKIM pub key on server:")
print(ru_pub)

# Query DNS for mail._domainkey.kavkazskitur.ru
try:
    answers = dns.resolver.resolve('mail._domainkey.kavkazskitur.ru', 'TXT')
    for r in answers:
        print("\nDNS TXT mail._domainkey.kavkazskitur.ru:")
        print(r.to_text())
except Exception as e:
    print("DNS Query error:", e)

try:
    answers = dns.resolver.resolve('kavkazskitur.ru', 'TXT')
    for r in answers:
        print("\nDNS TXT kavkazskitur.ru (SPF):")
        print(r.to_text())
except Exception as e:
    print("SPF error:", e)

try:
    answers = dns.resolver.resolve('_dmarc.kavkazskitur.ru', 'TXT')
    for r in answers:
        print("\nDNS TXT _dmarc.kavkazskitur.ru:")
        print(r.to_text())
except Exception as e:
    print("DMARC error:", e)

ssh.close()
