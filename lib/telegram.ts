// Small helper around the Telegram Bot API, used both for lead notifications
// and for sending admin 2FA login codes.

export function getTelegramCredentials() {
  const token =
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.TG_BOT_TOKEN ||
    process.env.BOT_TOKEN ||
    null;

  const defaultChatId =
    process.env.TELEGRAM_CHAT_ID ||
    process.env.TELEGRAM_ADMIN_CHAT_ID ||
    process.env.TG_CHAT_ID ||
    process.env.ADMIN_ID ||
    process.env.ADMIN_TELEGRAM_ID ||
    null;

  return { token, defaultChatId };
}

export async function sendTelegramMessage(
  text: string,
  chatId?: string | null,
  parseMode: 'Markdown' | 'HTML' = 'Markdown'
): Promise<boolean> {
  const { token, defaultChatId } = getTelegramCredentials();
  const targetChat = chatId || defaultChatId;

  if (!token || !targetChat) {
    console.warn('[Telegram] Missing bot token or chat id, skipping message.');
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChat,
        text,
        parse_mode: parseMode,
      }),
    });
    const data = await res.json();
    return Boolean(data?.ok);
  } catch (err) {
    console.error('[Telegram] sendMessage error:', err);
    return false;
  }
}
