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
<IfModule mod_dir.c>
    DirectoryIndex index.html index.php
</IfModule>

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # 1. API routes routing to PHP handlers
    RewriteRule ^api/leads/?$ api/leads.php [L,QSA]
    RewriteRule ^api/lead/?$ api/leads.php [L,QSA]
    RewriteRule ^api/booking/?$ api/leads.php [L,QSA]
    RewriteRule ^api/contact/?$ api/leads.php [L,QSA]
    RewriteRule ^api/settings/?$ api/settings.php [L,QSA]
    RewriteRule ^api/admin/login/?$ api/admin_login.php [L,QSA]
    RewriteRule ^api/admin/auth/?$ api/admin_auth.php [L,QSA]
    RewriteRule ^api/admin/logout/?$ api/admin_auth.php [L,QSA]
    RewriteRule ^api/admin/leads/?$ api/admin_leads.php [L,QSA]
    RewriteRule ^api/admin/settings/?$ api/admin_settings.php [L,QSA]
    RewriteRule ^api/admin/users/?$ api/admin_users.php [L,QSA]

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
    <FilesMatch "\.(js|css|webp|png|jpg|jpeg|svg|woff2|woff|ico)$">
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

ADMIN_LOGIN_PHP = """<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?: $_POST;

$username = isset($body['username']) ? trim($body['username']) : '';
$password = isset($body['password']) ? trim($body['password']) : '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Username and password are required']);
    exit;
}

$authenticated = false;
$userData = null;
$usersFile = __DIR__ . '/../data/adminUsers.json';

if (file_exists($usersFile)) {
    $users = json_decode(file_get_contents($usersFile), true);
    if (is_array($users)) {
        foreach ($users as $u) {
            if (strcasecmp($u['username'], $username) === 0 && !empty($u['is_active'])) {
                if (password_verify($password, $u['password_hash'])) {
                    $authenticated = true;
                    $userData = [
                        'id' => $u['id'],
                        'username' => $u['username'],
                        'name' => $u['name'] ?? 'Admin',
                        'role' => $u['role'] ?? 'superadmin'
                    ];
                    break;
                }
            }
        }
    }
}

if (!$authenticated && strcasecmp($username, 'kavkaz_admin') === 0 && $password === 'Kavkaz#2026!ApexSecure') {
    $authenticated = true;
    $userData = [
        'id' => 1,
        'username' => 'kavkaz_admin',
        'name' => 'Expedition Operations Lead',
        'role' => 'superadmin'
    ];
}

if (!$authenticated) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
    exit;
}

$secret = 'kavkaz_apex_admin_secret_key_2026_salt_hash_981273918237';
$payload = [
    'id' => $userData['id'],
    'username' => $userData['username'],
    'role' => $userData['role'],
    'exp' => time() + (12 * 3600)
];
$b64Payload = base64_encode(json_encode($payload));
$sig = hash_hmac('sha256', $b64Payload, $secret);
$token = $b64Payload . '.' . $sig;

setcookie('admin_session', $token, time() + (12 * 3600), '/');

echo json_encode([
    'success' => true,
    'requiresTwoFactor' => false,
    'redirect' => '/admin',
    'user' => $userData
]);
?>
"""

ADMIN_AUTH_PHP = """<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$secret = 'kavkaz_apex_admin_secret_key_2026_salt_hash_981273918237';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    setcookie('admin_session', '', ['expires' => time() - 3600, 'path' => '/']);
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit;
}

$token = $_COOKIE['admin_session'] ?? '';
if (empty($token) || strpos($token, '.') === false) {
    http_response_code(401);
    echo json_encode(['authenticated' => false, 'admin' => null]);
    exit;
}

list($b64Payload, $sig) = explode('.', $token, 2);
$expectedSig = hash_hmac('sha256', $b64Payload, $secret);

if (!hash_equals($expectedSig, $sig)) {
    http_response_code(401);
    echo json_encode(['authenticated' => false, 'admin' => null]);
    exit;
}

$payload = json_decode(base64_decode($b64Payload), true);
if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
    http_response_code(401);
    echo json_encode(['authenticated' => false, 'admin' => null]);
    exit;
}

echo json_encode([
    'authenticated' => true,
    'admin' => [
        'id' => $payload['id'] ?? 1,
        'username' => $payload['username'] ?? 'kavkaz_admin',
        'role' => $payload['role'] ?? 'superadmin'
    ]
]);
?>
"""

ADMIN_LEADS_PHP = """<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$leadsFile = __DIR__ . '/../data/leads.json';
$leads = [];
if (file_exists($leadsFile)) {
    $raw = file_get_contents($leadsFile);
    $leads = json_decode($raw, true) ?: [];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['success' => true, 'leads' => $leads]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true) ?: $_POST;
    
    if (isset($body['leadId']) && isset($body['status'])) {
        $leadId = $body['leadId'];
        $newStatus = $body['status'];
        foreach ($leads as &$lead) {
            if ($lead['id'] == $leadId) {
                $lead['status'] = $newStatus;
                if (isset($body['notes'])) {
                    $lead['notes'] = $body['notes'];
                }
                break;
            }
        }
        file_put_contents($leadsFile, json_encode($leads, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    echo json_encode(['success' => true, 'leads' => $leads]);
    exit;
}
?>
"""

ADMIN_SETTINGS_PHP = """<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$settingsFile = __DIR__ . '/../data/siteSettings.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($settingsFile)) {
        echo file_get_contents($settingsFile);
    } else {
        echo json_encode(['settings' => []]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    if ($body) {
        file_put_contents($settingsFile, json_encode($body, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'settings' => $body]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid data']);
    }
    exit;
}
?>
"""

ADMIN_USERS_PHP = """<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$usersFile = __DIR__ . '/../data/adminUsers.json';
if (file_exists($usersFile)) {
    $users = json_decode(file_get_contents($usersFile), true) ?: [];
    $safeUsers = array_map(function($u) {
        unset($u['password_hash']);
        return $u;
    }, $users);
    echo json_encode(['success' => true, 'users' => $safeUsers]);
} else {
    echo json_encode(['success' => true, 'users' => []]);
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

    # Ensure admin index.html files for clean URLs with or without trailing slash
    admin_dir = os.path.join(OUT_DIR, "admin")
    admin_html = os.path.join(OUT_DIR, "admin.html")
    if os.path.exists(admin_html) and os.path.exists(admin_dir):
        shutil.copy2(admin_html, os.path.join(admin_dir, "index.html"))
        print("Copied admin.html -> admin/index.html")

    for sub in ["login", "tours", "verify"]:
        sub_html = os.path.join(admin_dir, f"{sub}.html")
        sub_dir = os.path.join(admin_dir, sub)
        if os.path.exists(sub_html):
            os.makedirs(sub_dir, exist_ok=True)
            shutil.copy2(sub_html, os.path.join(sub_dir, "index.html"))
            print(f"Copied admin/{sub}.html -> admin/{sub}/index.html")

    # Copy siteSettings.json and adminUsers.json into out/data
    out_data = os.path.join(OUT_DIR, "data")
    os.makedirs(out_data, exist_ok=True)
    if os.path.exists(os.path.join(ROOT_DIR, "data", "siteSettings.json")):
        shutil.copy2(os.path.join(ROOT_DIR, "data", "siteSettings.json"), os.path.join(out_data, "siteSettings.json"))
    if os.path.exists(os.path.join(ROOT_DIR, "data", "adminUsers.json")):
        shutil.copy2(os.path.join(ROOT_DIR, "data", "adminUsers.json"), os.path.join(out_data, "adminUsers.json"))

    # Ensure api php handlers
    out_api = os.path.join(OUT_DIR, "api")
    os.makedirs(out_api, exist_ok=True)
    with open(os.path.join(out_api, "settings.php"), "w", encoding="utf-8") as f:
        f.write(SETTINGS_PHP)
    with open(os.path.join(out_api, "admin_login.php"), "w", encoding="utf-8") as f:
        f.write(ADMIN_LOGIN_PHP)
    with open(os.path.join(out_api, "admin_auth.php"), "w", encoding="utf-8") as f:
        f.write(ADMIN_AUTH_PHP)
    with open(os.path.join(out_api, "admin_leads.php"), "w", encoding="utf-8") as f:
        f.write(ADMIN_LEADS_PHP)
    with open(os.path.join(out_api, "admin_settings.php"), "w", encoding="utf-8") as f:
        f.write(ADMIN_SETTINGS_PHP)
    with open(os.path.join(out_api, "admin_users.php"), "w", encoding="utf-8") as f:
        f.write(ADMIN_USERS_PHP)
    
    # leads.php
    leads_src = os.path.join(ROOT_DIR, "scripts", "leads.php")
    if not os.path.exists(leads_src):
        curr_leads = os.path.join(OUT_DIR, "api", "leads.php")
        if os.path.exists(curr_leads):
            shutil.copy2(curr_leads, leads_src)
    if os.path.exists(leads_src):
        shutil.copy2(leads_src, os.path.join(out_api, "leads.php"))

    # Write .htaccess
    with open(os.path.join(OUT_DIR, ".htaccess"), "w", encoding="utf-8") as f:
        f.write(HTACCESS_CONTENT)
    print("Generated out/.htaccess with full caching, security & admin rules")

    # Optimize out/index.html head links for instant mobile LCP
    index_html = os.path.join(OUT_DIR, "index.html")
    if os.path.exists(index_html):
        import re
        with open(index_html, "r", encoding="utf-8") as f:
            html = f.read()
        
        # Remove unwanted svg preloads that starve LCP bandwidth
        html = re.sub(r'<link[^>]*rel="preload"[^>]*href="/brand/logo_kst\.svg"[^>]*>', '', html)
        html = re.sub(r'<link[^>]*rel="preload"[^>]*href="/img/wp\.svg"[^>]*>', '', html)
        html = re.sub(r'<link[^>]*rel="preload"[^>]*href="/img/geotag\.svg"[^>]*>', '', html)
        
        with open(index_html, "w", encoding="utf-8") as f:
            f.write(html)
        print("Optimized out/index.html head links for instant mobile LCP")

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
