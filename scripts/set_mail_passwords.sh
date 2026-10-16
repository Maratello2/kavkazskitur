#!/bin/bash
H=$(doveadm pw -s SHA512-CRYPT -p 'Kavkaz2026!Mail')
echo "info@kavkazskitur.ru:$H" > /etc/dovecot/users
echo "info@kavkazskitur.com:$H" >> /etc/dovecot/users
chmod 640 /etc/dovecot/users
chown root:dovecot /etc/dovecot/users
systemctl restart dovecot
echo "PASSWORDS UPDATED SUCCESSFULLY"
