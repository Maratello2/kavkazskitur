<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-cache, no-store, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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
