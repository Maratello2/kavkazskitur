<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token');
header('Cache-Control: no-cache, no-store, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function checkAdminAuth() {
    $secret = 'kavkaz_apex_admin_secret_key_2026_salt_hash_981273918237';
    $token = $_COOKIE['admin_session'] ?? $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if (empty($token) && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Bearer\s+(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $m)) {
            $token = $m[1];
        }
    }
    if (empty($token) || strpos($token, '.') === false) {
        return false;
    }
    list($b64Payload, $sig) = explode('.', $token, 2);
    $expectedSig = hash_hmac('sha256', $b64Payload, $secret);
    if (!hash_equals($expectedSig, $sig)) {
        return false;
    }
    $payload = json_decode(base64_decode($b64Payload), true);
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
        return false;
    }
    return $payload;
}

if (!checkAdminAuth()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$settingsFile = __DIR__ . '/../data/siteSettings.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($settingsFile)) {
        $raw = file_get_contents($settingsFile);
        $data = json_decode($raw, true) ?: [];
        $resp = array_merge($data, ['settings' => $data]);
        echo json_encode($resp, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['settings' => []]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    if ($body) {
        $toSave = (isset($body['settings']) && is_array($body['settings'])) ? $body['settings'] : $body;
        file_put_contents($settingsFile, json_encode($toSave, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'settings' => $toSave]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid data']);
    }
    exit;
}
?>
