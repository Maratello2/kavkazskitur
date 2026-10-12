<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, no-store, must-revalidate');

$settingsFile = __DIR__ . '/../data/siteSettings.json';
if (file_exists($settingsFile)) {
    $raw = file_get_contents($settingsFile);
    $data = json_decode($raw, true) ?: [];
    $resp = array_merge($data, ['settings' => $data]);
    echo json_encode($resp, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["settings" => ["status" => "ok"]]);
}
?>
