import urllib.request
import ssl
import re

ctx = ssl.create_default_context()

for url in ['https://kavkazskitur.com/', 'https://kavkazskitur.ru/']:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
        html = res.read().decode('utf-8', errors='replace')
        title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
        title = title_match.group(1).strip() if title_match else 'No title'
        print(f"URL: {url}")
        print(f"Title: {title}")
        print(f"Length: {len(html)} chars\n")
