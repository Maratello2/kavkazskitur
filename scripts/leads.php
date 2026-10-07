<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true);

if (!$body && !empty($_POST)) {
    $body = $_POST;
}

if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

// 1. Honeypot check
$website_hp = isset($body['website_hp']) ? trim($body['website_hp']) : '';
if (!empty($website_hp)) {
    echo json_encode(['success' => true, 'redirectUrl' => '']);
    exit;
}

// 2. Consent check (152-FZ)
$consent = isset($body['consent']) ? $body['consent'] : (isset($body['consent_152fz']) ? $body['consent_152fz'] : false);
$hasConsent = ($consent === true || $consent === 'true' || $consent === 1 || $consent === '1');
if (!$hasConsent) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Consent with terms of service and privacy policy is required.']);
    exit;
}

$name = isset($body['name']) ? trim($body['name']) : 'Гость';
$phone = isset($body['phone']) ? trim($body['phone']) : '';
$tour = isset($body['tourName']) ? $body['tourName'] : (isset($body['tour_name']) ? $body['tour_name'] : 'Экспедиция на Эльбрус');
$dates = isset($body['dates']) ? $body['dates'] : (isset($body['date']) ? $body['date'] : 'Сезон 2026');
$comment = isset($body['comment']) ? $body['comment'] : (isset($body['message']) ? $body['message'] : '');

if (empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Phone number is required.']);
    exit;
}

$leadId = round(microtime(true) * 1000);
$createdAt = date('c');

$lead = [
    'id' => $leadId,
    'name' => $name,
    'phone' => $phone,
    'tourName' => $tour,
    'dates' => $dates,
    'comment' => $comment,
    'createdAt' => $createdAt,
    'status' => 'new'
];

// 3. Save to data/leads.json
$leadsDir = __DIR__ . '/../data';
if (!is_dir($leadsDir)) {
    @mkdir($leadsDir, 0755, true);
}
$leadsFile = $leadsDir . '/leads.json';
$leads = [];
if (file_exists($leadsFile)) {
    $existing = @file_get_contents($leadsFile);
    $leads = json_decode($existing, true) ?: [];
}
array_unshift($leads, $lead);
@file_put_contents($leadsFile, json_encode($leads, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// 4. Dispatch Telegram if configured
$envFile = __DIR__ . '/../.env';
$tgToken = getenv('TELEGRAM_BOT_TOKEN');
$tgChatId = getenv('TELEGRAM_CHAT_ID');

if ((!$tgToken || !$tgChatId) && file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            $parts = explode('=', $line, 2);
            $k = trim($parts[0]);
            $v = trim($parts[1], " \t\n\r\0\x0B\"'");
            if ($k === 'TELEGRAM_BOT_TOKEN') $tgToken = $v;
            if ($k === 'TELEGRAM_CHAT_ID') $tgChatId = $v;
        }
    }
}

if ($tgToken && $tgChatId) {
    $tgMsg = "🏔 *Новая заявка на тур!*\n\n*Тур:* " . $tour . "\n*Даты:* " . $dates . "\n*Клиент:* " . $name . "\n*Телефон:* " . $phone;
    if ($comment) {
        $tgMsg .= "\n*Заметка:* " . $comment;
    }
    $ch = curl_init('https://api.telegram.org/bot' . $tgToken . '/sendMessage');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'chat_id' => $tgChatId,
        'text' => $tgMsg,
        'parse_mode' => 'Markdown'
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    @curl_exec($ch);
    @curl_close($ch);
}

// 5. WhatsApp redirect URL
$waText = "Expedition Booking Request\n\nTour: " . $tour . "\nDates: " . $dates . "\nName: " . $name . "\nPhone: " . $phone;
$redirectUrl = 'https://wa.me/79280828413?text=' . urlencode($waText);

echo json_encode([
    'success' => true,
    'redirectUrl' => $redirectUrl,
    'leadId' => $leadId
], JSON_UNESCAPED_UNICODE);
?>
