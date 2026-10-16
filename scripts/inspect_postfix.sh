#!/bin/bash
exec > /var/www/gotoelbrus.ru/uploads/postfix_inspect.txt 2>&1
echo "=== POSTCONF -N ==="
postconf -n

echo ""
echo "=== ALIASES ==="
cat /etc/aliases 2>/dev/null
grep -rn "tflancer" /etc/postfix/ 2>/dev/null
grep -rn "tflancer" /etc/aliases 2>/dev/null
grep -rn "tflancer" /etc/ 2>/dev/null
