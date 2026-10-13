<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token');

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

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    if (!$input || !isset($input['name']) || !isset($input['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing name or slug']);
        exit;
    }

    $cats = loadCategories($dataFile);
    $slug = trim($input['slug']);
    
    // Check slug uniqueness
    foreach ($cats as $c) {
        if ($c['slug'] === $slug) {
            http_response_code(409);
            echo json_encode(['success' => false, 'error' => 'Category with this slug already exists']);
            exit;
        }
    }

    $input['id'] = $slug;
    $input['createdAt'] = date('c');
    $input['updatedAt'] = date('c');
    $cats[] = $input;

    if (saveCategories($dataFile, $cats)) {
        echo json_encode(['success' => true, 'category' => $input]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save category']);
    }
    exit;
}

if ($method === 'PUT') {
    if (!$input || !isset($input['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing slug']);
        exit;
    }

    $cats = loadCategories($dataFile);
    $slug = trim($input['slug']);
    $found = false;

    foreach ($cats as $k => $c) {
        if ($c['slug'] === $slug) {
            $input['updatedAt'] = date('c');
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

    if (saveCategories($dataFile, $cats)) {
        echo json_encode(['success' => true, 'category' => $cats[$k]]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update category']);
    }
    exit;
}

if ($method === 'DELETE') {
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : ($input['slug'] ?? null);
    if (!$slug) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing slug']);
        exit;
    }

    $cats = loadCategories($dataFile);
    $newCats = [];
    $found = false;

    foreach ($cats as $c) {
        if ($c['slug'] === $slug) {
            $found = true;
        } else {
            $newCats[] = $c;
        }
    }

    if (!$found) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Category not found']);
        exit;
    }

    if (saveCategories($dataFile, $newCats)) {
        echo json_encode(['success' => true, 'message' => 'Category deleted']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to delete category']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
?>
