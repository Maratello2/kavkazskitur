<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../data/categories.json';

// Ensure data directory exists
if (!is_dir(dirname($dataFile))) {
    mkdir(dirname($dataFile), 0777, true);
}

function loadCategories($path) {
    if (file_exists($path)) {
        $content = file_get_contents($path);
        $data = json_decode($content, true);
        if (is_array($data)) return $data;
    }
    return [];
}

function saveCategories($path, $cats) {
    return file_put_contents($path, json_encode($cats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $cats = loadCategories($dataFile);
    echo json_encode(['success' => true, 'categories' => $cats], JSON_UNESCAPED_UNICODE);
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
$cats = loadCategories($dataFile);

if ($method === 'POST') {
    if (empty($input['name'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category name is required']);
        exit;
    }

    if (empty($input['slug'])) {
        $input['slug'] = preg_replace('/[^a-z0-9]+/i', '-', strtolower($input['name']));
        $input['slug'] = trim($input['slug'], '-');
    }

    if (empty($input['id'])) {
        $input['id'] = $input['slug'];
    }

    if (!isset($input['headerGroup'])) {
        $input['headerGroup'] = 'ACTIVITIES';
    }

    if (!isset($input['showInHeader'])) {
        $input['showInHeader'] = true;
    }

    // Check duplicate slug
    foreach ($cats as $c) {
        if ($c['slug'] === $input['slug']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Category with this slug already exists']);
            exit;
        }
    }

    $input['order'] = count($cats) + 1;
    $cats[] = $input;
    saveCategories($dataFile, $cats);
    echo json_encode(['success' => true, 'category' => $input, 'categories' => $cats], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'PUT') {
    $id = $input['id'] ?? null;
    $slug = $input['slug'] ?? null;

    if (!$id && !$slug) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID or Slug required']);
        exit;
    }

    $found = false;
    foreach ($cats as $k => $c) {
        if (($id && $c['id'] === $id) || ($slug && $c['slug'] === $slug)) {
            $cats[$k] = array_merge($c, $input);
            $found = true;
            break;
        }
    }

    if (!$found) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Category not found']);
        exit;
    }

    saveCategories($dataFile, $cats);
    echo json_encode(['success' => true, 'categories' => $cats], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? $input['id'] ?? null;
    $slug = $_GET['slug'] ?? $input['slug'] ?? null;

    if (!$id && !$slug) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID or Slug required']);
        exit;
    }

    $cats = array_values(array_filter($cats, function($c) use ($id, $slug) {
        if ($id && $c['id'] === $id) return false;
        if ($slug && $c['slug'] === $slug) return false;
        return true;
    }));

    saveCategories($dataFile, $cats);
    echo json_encode(['success' => true, 'categories' => $cats], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
