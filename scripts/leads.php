<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

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

$name = isset($body['name']) ? trim($body['name']) : 'Guest';
$phone = isset($body['phone']) ? trim($body['phone']) : '';
$tour = isset($body['tourName']) ? $body['tourName'] : (isset($body['tour_name']) ? $body['tour_name'] : 'Mount Elbrus Expedition');
$dates = isset($body['dates']) ? $body['dates'] : (isset($body['date']) ? $body['date'] : 'Season 2026');
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

// 4. Load environment variables
$envFile = __DIR__ . '/../.env';
$tgToken = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$tgChatId = getenv('TELEGRAM_CHAT_ID') ?: '';
$adminEmail = getenv('ADMIN_NOTIFICATION_EMAIL') ?: '';
$smtpHost = getenv('SMTP_HOST') ?: '';
$smtpPort = intval(getenv('SMTP_PORT') ?: 465);
$smtpUser = getenv('SMTP_USER') ?: '';
$smtpPass = getenv('SMTP_PASS') ?: '';
$smtpFrom = getenv('SMTP_FROM') ?: 'noreply@kavkazskitur.com';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            $parts = explode('=', $line, 2);
            $k = trim($parts[0]);
            $v = trim($parts[1], " \t\n\r\0\x0B\"'");
            if ($k === 'TELEGRAM_BOT_TOKEN' && !$tgToken) $tgToken = $v;
            if ($k === 'TELEGRAM_CHAT_ID' && !$tgChatId) $tgChatId = $v;
            if ($k === 'ADMIN_NOTIFICATION_EMAIL' && !$adminEmail) $adminEmail = $v;
            if ($k === 'SMTP_HOST' && !$smtpHost) $smtpHost = $v;
            if ($k === 'SMTP_PORT') $smtpPort = intval($v);
            if ($k === 'SMTP_USER' && !$smtpUser) $smtpUser = $v;
            if ($k === 'SMTP_PASS' && !$smtpPass) $smtpPass = $v;
            if ($k === 'SMTP_FROM' && !$smtpFrom) $smtpFrom = $v;
        }
    }
}

// 4.1 Dispatch Telegram if configured
if ($tgToken && $tgChatId) {
    $tgMsg = "🏔 *New Expedition Inquiry!*\n\n*Tour:* " . $tour . "\n*Dates:* " . $dates . "\n*Climber:* " . $name . "\n*Phone:* " . $phone;
    if ($comment) {
        $tgMsg .= "\n*Notes:* " . $comment;
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

// 4.2 Dispatch Email Notification
$emailRecipients = [];
if (!empty($adminEmail)) {
    foreach (explode(',', $adminEmail) as $em) {
        $em = trim($em);
        if (filter_var($em, FILTER_VALIDATE_EMAIL)) {
            $emailRecipients[] = $em;
        }
    }
}
if (empty($emailRecipients)) {
    $emailRecipients = ['info@kavkazskitur.com', 'info@kavkazskitur.ru'];
}

$emailSubject = "🏔 Новая заявка на тур: " . $tour . " (" . $name . ")";
$encodedSubject = '=?UTF-8?B?' . base64_encode($emailSubject) . '?=';

$emailBodyHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' . htmlspecialchars($emailSubject, ENT_QUOTES, 'UTF-8') . '</title></head>' .
'<body style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #0b101d; color: #f8fafc; margin: 0; padding: 24px;">' .
'<div style="max-width: 600px; margin: 0 auto; background-color: #0e1726; border: 1px solid rgba(255,106,0,0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">' .
'<div style="background: linear-gradient(135deg, #FF6A00 0%, #D84315 100%); padding: 20px 24px; text-align: left;">' .
'<h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.05em;">KAVKAZSKITUR • НОВАЯ ЗАЯВКА</h1>' .
'<p style="color: rgba(255,255,255,0.9); margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Экспедиционный отдел КавказСкиТур</p>' .
'</div>' .
'<div style="padding: 24px;">' .
'<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">' .
'<tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; width: 140px;">Тур / Программа:</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff; font-size: 14px; font-weight: bold;">' . htmlspecialchars($tour, ENT_QUOTES, 'UTF-8') . '</td></tr>' .
'<tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px;">Имя участника:</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff; font-size: 14px; font-weight: bold;">' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</td></tr>' .
'<tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px;">Телефон:</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 15px; font-weight: bold; font-family: monospace;">' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '</td></tr>' .
'<tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px;">Даты восхождения:</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff; font-size: 14px;">' . htmlspecialchars($dates, ENT_QUOTES, 'UTF-8') . '</td></tr>' .
(!empty($comment) ? '<tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 13px; vertical-align: top;">Комментарий / Детали:</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #e2e8f0; font-size: 13px; line-height: 1.5;">' . nl2br(htmlspecialchars($comment, ENT_QUOTES, 'UTF-8')) . '</td></tr>' : '') .
'<tr><td style="padding: 10px 0; color: #94a3b8; font-size: 12px;">Время отправки:</td><td style="padding: 10px 0; color: #64748b; font-size: 12px; font-family: monospace;">' . htmlspecialchars($createdAt, ENT_QUOTES, 'UTF-8') . ' (ID: ' . $leadId . ')</td></tr>' .
'</table>' .
'<div style="text-align: center; margin-top: 24px;">' .
'<a href="https://wa.me/' . preg_replace('/[^0-9]/', '', $phone) . '" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 10px; margin-right: 10px;">Написать клиенту в WhatsApp</a>' .
'<a href="tel:' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '" style="display: inline-block; background-color: #FF6A00; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 10px;">Позвонить клиенту</a>' .
'</div></div>' .
'<div style="background-color: #070c17; padding: 14px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05);">' .
'ООО &laquo;КавКазСкиТур&raquo; &bull; Нальчик, ул. Горького 74 &bull; Приют Бочки 3800 м' .
'</div></div></body></html>';

function sendDirectSmtp($host, $port, $user, $pass, $from, $to, $subject, $html) {
    $isSsl = ($port == 465);
    $addr = ($isSsl ? 'ssl://' : '') . $host;
    $sock = @fsockopen($addr, $port, $errno, $errstr, 5);
    if (!$sock) return false;
    
    $read = function() use ($sock) {
        $res = '';
        while (!feof($sock)) {
            $line = fgets($sock, 512);
            $res .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $res;
    };
    $write = function($cmd) use ($sock) {
        fputs($sock, $cmd . "\r\n");
    };
    
    $read();
    $write("EHLO " . ($host ?: 'kavkazskitur.com'));
    $ehlo = $read();
    
    if ($port == 587 && strpos($ehlo, 'STARTTLS') !== false) {
        $write("STARTTLS");
        $read();
        stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $write("EHLO " . ($host ?: 'kavkazskitur.com'));
        $read();
    }
    
    if (!empty($user) && !empty($pass)) {
        $write("AUTH LOGIN");
        $read();
        $write(base64_encode($user));
        $read();
        $write(base64_encode($pass));
        $authRes = $read();
        if (substr($authRes, 0, 3) !== '235') {
            fclose($sock);
            return false;
        }
    }
    
    $write("MAIL FROM: <" . $from . ">");
    $read();
    $write("RCPT TO: <" . $to . ">");
    $read();
    $write("DATA");
    $read();
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: KavKazSkiTur Leads <' . $from . '>',
        'To: <' . $to . '>',
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'Date: ' . date('r'),
        'X-Mailer: KavKazSkiTur-Mailer'
    ];
    $write(implode("\r\n", $headers) . "\r\n\r\n" . $html . "\r\n.");
    $read();
    $write("QUIT");
    $read();
    fclose($sock);
    return true;
}

$cleanFrom = !empty($smtpFrom) ? $smtpFrom : 'noreply@kavkazskitur.com';
$emailHeaders = "MIME-Version: 1.0\r\n" .
                "Content-Type: text/html; charset=UTF-8\r\n" .
                "Content-Transfer-Encoding: 8bit\r\n" .
                "From: KavKazSkiTur Leads <" . $cleanFrom . ">\r\n" .
                "Reply-To: " . $cleanFrom . "\r\n" .
                "X-Mailer: PHP/" . phpversion();

foreach ($emailRecipients as $toEmail) {
    $sent = false;
    if (!empty($smtpHost) && !empty($smtpUser)) {
        $sent = sendDirectSmtp($smtpHost, $smtpPort, $smtpUser, $smtpPass, $cleanFrom, $toEmail, $emailSubject, $emailBodyHtml);
    }
    if (!$sent) {
        @mail($toEmail, $encodedSubject, $emailBodyHtml, $emailHeaders, "-f " . $cleanFrom);
    }
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
