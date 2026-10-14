import urllib.request
import ssl
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ctx = ssl.create_default_context()

pages = [
    '/',
    '/contact-us/',
    '/tours/',
    '/aboutus/',
    '/services/',
    '/elbrus-summit/',
    '/excursions/',
    '/jeep-tours/',
    '/faqs/'
]

for p in pages:
    url = 'https://kavkazskitur.com' + p
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as res:
            html = res.read().decode('utf-8', errors='replace')
            has_footer = ('footer' in html)
            has_close = ('</html>' in html)
            print(f"{p} -> HTTP {res.getcode()}, Length: {len(html)}, Footer: {has_footer}, </html>: {has_close}")
    except Exception as e:
        print(f"{p} -> Error: {e}")
