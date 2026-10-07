import os
import shutil
import subprocess
import sys
import tarfile

import tempfile

ROOT_DIR = r"d:\Desktop\kavkazskitur"
APP_API = os.path.join(ROOT_DIR, "app", "api")
SRC_API = os.path.join(ROOT_DIR, "src", "app", "api")
TEMP_API = os.path.join(tempfile.gettempdir(), "_temp_kavkaz_api_disabled")
OUT_DIR = os.path.join(ROOT_DIR, "out")

HTACCESS_CONTENT = r"""# KavKazSkiTur Production Apache Configuration
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # 1. API routes routing to PHP handlers
    RewriteRule ^api/leads/?$ api/leads.php [L,QSA]
    RewriteRule ^api/lead/?$ api/leads.php [L,QSA]
    RewriteRule ^api/booking/?$ api/leads.php [L,QSA]
    RewriteRule ^api/contact/?$ api/leads.php [L,QSA]
    RewriteRule ^api/settings/?$ api/settings.php [L,QSA]

    # Block public access to data/ storage and env files
    RewriteRule ^data/ - [F,L]
    RewriteRule ^\.env - [F,L]

    # 2. Redirect /index.html to /
    RewriteCond %{THE_REQUEST} ^[A-Z]{3,9}\ /index\.html\ HTTP/
    RewriteRule ^index\.html$ / [R=301,L]

    # 3. Clean URLs: serve .html if file exists without extension
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME}.html -f
    RewriteRule ^(.+)$ $1.html [L]

    # 4. Handle subdirectories with index.html
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteCond %{REQUEST_FILENAME}/index.html -f
    RewriteRule ^(.+)/?$ $1/index.html [L]
</IfModule>

# Custom 404 error page
ErrorDocument 404 /404.html

# Security & Best Practices Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>

# Browser Caching for Performance
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\\.(js|css|webp|png|jpg|jpeg|svg|woff2|woff|ico)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</IfModule>

# Enable Gzip / Deflate Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml image/svg+xml
</IfModule>
"""

SETTINGS_PHP = """<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=3600');

$settingsFile = __DIR__ . '/../data/siteSettings.json';
if (file_exists($settingsFile)) {
    echo file_get_contents($settingsFile);
} else {
    echo json_encode(["settings" => ["status" => "ok"]]);
}
?>
"""

def step(msg):
    print(f"\n==========================================")
    print(f" {msg}")
    print(f"==========================================")

def run_build():
    step("1. Preparing Next.js static export build")
    if os.path.exists(TEMP_API):
        shutil.rmtree(TEMP_API)
    os.makedirs(TEMP_API, exist_ok=True)

    has_app_api = os.path.exists(APP_API)
    has_src_api = os.path.exists(SRC_API)

    if has_app_api:
        shutil.move(APP_API, os.path.join(TEMP_API, "app_api"))
    if has_src_api:
        shutil.move(SRC_API, os.path.join(TEMP_API, "src_api"))

    build_ok = False
    try:
        step("2. Running npm run build with NEXT_EXPORT=true")
        env = os.environ.copy()
        env["NEXT_EXPORT"] = "true"
        proc = subprocess.run(["npm", "run", "build"], cwd=ROOT_DIR, env=env, shell=True)
        if proc.returncode == 0:
            build_ok = True
        else:
            print("ERROR: Build failed!")
    finally:
        step("3. Restoring API directories")
        if has_app_api and os.path.exists(os.path.join(TEMP_API, "app_api")):
            if os.path.exists(APP_API):
                shutil.rmtree(APP_API)
            shutil.move(os.path.join(TEMP_API, "app_api"), APP_API)
        if has_src_api and os.path.exists(os.path.join(TEMP_API, "src_api")):
            if os.path.exists(SRC_API):
                shutil.rmtree(SRC_API)
            shutil.move(os.path.join(TEMP_API, "src_api"), SRC_API)
        if os.path.exists(TEMP_API):
            shutil.rmtree(TEMP_API)

    if not build_ok:
        sys.exit(1)

    step("4. Post-processing exported files")
    # Ensure tours/index.html
    tours_dir = os.path.join(OUT_DIR, "tours")
    tours_html = os.path.join(OUT_DIR, "tours.html")
    if os.path.exists(tours_html) and os.path.exists(tours_dir):
        shutil.copy2(tours_html, os.path.join(tours_dir, "index.html"))
        print("Copied tours.html -> tours/index.html")

    # Copy siteSettings.json into out/data
    out_data = os.path.join(OUT_DIR, "data")
    os.makedirs(out_data, exist_ok=True)
    shutil.copy2(os.path.join(ROOT_DIR, "data", "siteSettings.json"), os.path.join(out_data, "siteSettings.json"))

    # Ensure api php handlers
    out_api = os.path.join(OUT_DIR, "api")
    os.makedirs(out_api, exist_ok=True)
    with open(os.path.join(out_api, "settings.php"), "w", encoding="utf-8") as f:
        f.write(SETTINGS_PHP)
    
    # leads.php
    leads_src = os.path.join(ROOT_DIR, "scripts", "leads.php")
    if not os.path.exists(leads_src):
        # copy from out/api/leads.php if present
        curr_leads = os.path.join(OUT_DIR, "api", "leads.php")
        if os.path.exists(curr_leads):
            shutil.copy2(curr_leads, leads_src)
    if os.path.exists(leads_src):
        shutil.copy2(leads_src, os.path.join(out_api, "leads.php"))

    # Write .htaccess
    with open(os.path.join(OUT_DIR, ".htaccess"), "w", encoding="utf-8") as f:
        f.write(HTACCESS_CONTENT)
    print("Generated out/.htaccess with full caching & security rules")

    step("5. Creating deployment archive")
    tar_path = os.path.join(ROOT_DIR, "prod_deploy.tar.gz")
    if os.path.exists(tar_path):
        os.remove(tar_path)
    with tarfile.open(tar_path, "w:gz") as tar:
        for item in os.listdir(OUT_DIR):
            p = os.path.join(OUT_DIR, item)
            tar.add(p, arcname=item)
    sz_mb = round(os.path.getsize(tar_path) / (1024 * 1024), 2)
    print(f"Created {tar_path} ({sz_mb} MB)")

if __name__ == "__main__":
    run_build()
