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

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    if (!$input || !isset($input['title']) || !isset($input['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing title or slug']);
        exit;
    }

    $tours = loadTours($dataFile);
    $slug = trim($input['slug']);
    
    // Check slug uniqueness
    foreach ($tours as $t) {
        if ($t['slug'] === $slug) {
            http_response_code(409);
            echo json_encode(['success' => false, 'error' => 'Tour with this slug already exists']);
            exit;
        }
    }

    $input['id'] = $slug;
    $input['createdAt'] = date('c');
    $input['updatedAt'] = date('c');
    $tours[] = $input;

    if (saveTours($dataFile, $tours)) {
        echo json_encode(['success' => true, 'tour' => $input]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save tour']);
    }
    exit;
}

if ($method === 'PUT') {
    if (!$input || !isset($input['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing slug']);
        exit;
    }

    $tours = loadTours($dataFile);
    $slug = trim($input['slug']);
    $found = false;

    foreach ($tours as $k => $t) {
        if ($t['slug'] === $slug) {
            $input['updatedAt'] = date('c');
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

    if (saveTours($dataFile, $tours)) {
        echo json_encode(['success' => true, 'tour' => $tours[$k]]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update tour']);
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

    $tours = loadTours($dataFile);
    $newTours = [];
    $found = false;

    foreach ($tours as $t) {
        if ($t['slug'] === $slug) {
            $found = true;
        } else {
            $newTours[] = $t;
        }
    }

    if (!$found) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Tour not found']);
        exit;
    }

    if (saveTours($dataFile, $newTours)) {
        echo json_encode(['success' => true, 'message' => 'Tour deleted']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to delete tour']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
?>
