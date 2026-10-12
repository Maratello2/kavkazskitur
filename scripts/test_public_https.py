import urllib.request
import ssl
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ctx = ssl.create_default_context()

urls = [
    'https://kavkazskitur.com/',
    'https://kavkazskitur.ru/',
    'https://elbrus-barrels.com/',
    'http://gotoelbrus.ru/',
    'https://gotoelbrus.ru/'
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, context=ctx, timeout=10)
        final_url = res.geturl()
        print(f"{url} -> HTTP {res.getcode()} (Final: {final_url})")
    except urllib.error.HTTPError as e:
        print(f"{url} -> HTTP {e.code} ({e.reason})")
    except Exception as e:
        print(f"{url} -> Error: {e}")
