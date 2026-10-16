import socket
import sys

for host in ['mail.kavkazskitur.ru', '161.104.35.24']:
    print(f"=== Testing {host} ===")
    try:
        ip = socket.gethostbyname(host)
        print(f"Resolved IP: {ip}")
    except Exception as e:
        print(f"DNS resolve failed: {e}")
        continue
        
    for port in [80, 443, 993, 143, 465, 587, 25]:
        s = socket.socket()
        s.settimeout(3)
        res = s.connect_ex((ip, port))
        status = "OPEN" if res == 0 else f"FAILED ({res})"
        print(f"Port {port}: {status}")
        s.close()
