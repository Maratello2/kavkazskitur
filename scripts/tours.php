<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dataFile = __DIR__ . '/../data/tours.json';
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    if (!empty($_GET['slug'])) {
        $slug = trim($_GET['slug']);
        $tours = json_decode($content, true);
        if (is_array($tours)) {
            foreach ($tours as $t) {
                if (isset($t['slug']) && $t['slug'] === $slug) {
                    echo json_encode(['success' => true, 'tour' => $t], JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }
        echo json_encode(['success' => false, 'error' => 'Tour not found'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    echo $content;
} else {
    echo json_encode([]);
}
