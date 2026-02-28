export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!BOT_TOKEN || !CHAT_ID) {
        console.error('Missing Telegram credentials');
        return res.status(500).json({ error: 'Server configuration error' });
    }
    
    try {
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `🔔 Your friend wants to chat!\n⏰ ${new Date().toLocaleString()}`,
                    parse_mode: 'HTML'
                })
            }
        );
        
        if (!telegramResponse.ok) {
            throw new Error('Telegram API error');
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
}