<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../data/tours.json';

// Ensure data directory exists
if (!is_dir(dirname($dataFile))) {
    mkdir(dirname($dataFile), 0777, true);
}

function loadTours($path) {
    if (file_exists($path)) {
        $content = file_get_contents($path);
        $data = json_decode($content, true);
        if (is_array($data)) return $data;
    }
    return [];
}

function saveTours($path, $tours) {
    return file_put_contents($path, json_encode($tours, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $tours = loadTours($dataFile);
    echo json_encode(['success' => true, 'tours' => $tours], JSON_UNESCAPED_UNICODE);
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
    if (!empty($token) && strpos($token, '.') !== false) {
        list($b64Payload, $sig) = explode('.', $token, 2);
        $expectedSig = hash_hmac('sha256', $b64Payload, $secret);
        if (hash_equals($expectedSig, $sig)) {
            $payload = json_decode(base64_decode($b64Payload), true);
            if ($payload && isset($payload['exp']) && $payload['exp'] >= time()) {
                return true;
            }
        }
    }
    $sessionFile = __DIR__ . '/../data/.admin_session';
    if (file_exists($sessionFile) && !empty($token)) {
        if (trim(file_get_contents($sessionFile)) === $token) return true;
    }
    return false;
}

if (!checkAdminAuth()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$tours = loadTours($dataFile);

if ($method === 'POST') {
    if (empty($input['name']) && empty($input['title'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Tour name is required']);
        exit;
    }
    
    $newId = time();
    $input['id'] = $newId;
    if (empty($input['slug'])) {
        $input['slug'] = 'tour-' . $newId;
    }
    if (empty($input['title'])) {
        $input['title'] = $input['name'];
    }
    if (empty($input['name'])) {
        $input['name'] = $input['title'];
    }
    
    array_unshift($tours, $input);
    saveTours($dataFile, $tours);
    echo json_encode(['success' => true, 'tour' => $input, 'tours' => $tours], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'PUT') {
    $id = $input['id'] ?? null;
    $slug = $input['slug'] ?? null;
    
    if (!$id && !$slug) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID or Slug required for update']);
        exit;
    }

    $found = false;
    foreach ($tours as $k => $t) {
        if (($id && (string)$t['id'] === (string)$id) || ($slug && $t['slug'] === $slug)) {
            $tours[$k] = array_merge($t, $input);
            $found = true;
            break;
        }
    }

    if (!$found) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Tour not found']);
        exit;
    }

    saveTours($dataFile, $tours);
    echo json_encode(['success' => true, 'tours' => $tours], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? $input['id'] ?? null;
    $slug = $_GET['slug'] ?? $input['slug'] ?? null;

    if (!$id && !$slug) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID or Slug required for deletion']);
        exit;
    }

    $tours = array_values(array_filter($tours, function($t) use ($id, $slug) {
        if ($id && (string)$t['id'] === (string)$id) return false;
        if ($slug && $t['slug'] === $slug) return false;
        return true;
    }));

    saveTours($dataFile, $tours);
    echo json_encode(['success' => true, 'tours' => $tours], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
