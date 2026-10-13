import urllib.request
import ssl
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ctx = ssl.create_default_context()

sites = [
    'https://kavkazskitur.com/',
    'https://kavkazskitur.ru/',
    'https://elbrus-barrels.com/',
    'https://gotoelbrus.ru/'
]

for url in sites:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
            html = res.read().decode('utf-8', errors='replace')
            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
            title = title_match.group(1).strip() if title_match else 'No title'
            print(f"URL: {url} -> HTTP {res.getcode()}")
            print(f"  Title: {title}")
            print(f"  Length: {len(html)} chars\n")
    except Exception as e:
        print(f"URL: {url} -> ERROR: {e}\n")
