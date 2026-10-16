import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('161.104.35.24', port=2222, username='root', password='qCQFo9AD56Tq')

new_dovecot_conf = """protocols = imap pop3 lmtp sieve
listen = *, [::]

ssl = yes
ssl_cert = </etc/letsencrypt/live/mail.kavkazskitur.ru/fullchain.pem
ssl_key = </etc/letsencrypt/live/mail.kavkazskitur.ru/privkey.pem
ssl_min_protocol = TLSv1.2

mail_location = maildir:/var/mail/vhosts/%d/%n:LAYOUT=fs
mail_uid = 5000
mail_gid = 5000
mail_privileged_group = vmail

auth_mechanisms = plain login
disable_plaintext_auth = no

passdb {
  driver = passwd-file
  args = scheme=SHA512-CRYPT username_format=%u /etc/dovecot/users
}

userdb {
  driver = static
  args = uid=5000 gid=5000 home=/var/mail/vhosts/%d/%n
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}

service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
}

service imap-login {
  inet_listener imap {
    port = 143
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}

protocol lmtp {
  mail_plugins = $mail_plugins sieve
}

plugin {
  sieve = file:~/sieve;active=~/.dovecot.sieve
  sieve_default = /etc/dovecot/sieve/default.sieve
  sieve_global = /etc/dovecot/sieve/
}

namespace inbox {
  inbox = yes
  mailbox Junk {
    auto = subscribe
    special_use = \\Junk
  }
  mailbox Trash {
    auto = subscribe
    special_use = \\Trash
  }
  mailbox Sent {
    auto = subscribe
    special_use = \\Sent
  }
  mailbox Drafts {
    auto = subscribe
    special_use = \\Drafts
  }
}
"""

sftp = ssh.open_sftp()
with sftp.file('/etc/dovecot/dovecot.conf', 'w') as f:
    f.write(new_dovecot_conf)
sftp.close()

_, out, err = ssh.exec_command('systemctl restart dovecot && doveconf -n')
print(out.read().decode())
print(err.read().decode())
ssh.close()
