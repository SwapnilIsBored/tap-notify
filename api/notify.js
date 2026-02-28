export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const YOUR_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const FRIEND_CHAT_ID = process.env.FRIEND_CHAT_ID;
    
    if (!BOT_TOKEN || !YOUR_CHAT_ID || !FRIEND_CHAT_ID) {
        console.error('Missing credentials');
        return res.status(500).json({ error: 'Server configuration error' });
    }
    
    try {
        // Send to BOTH people
        const chatIds = [YOUR_CHAT_ID, FRIEND_CHAT_ID];
        
        for (const chatId of chatIds) {
            await fetch(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `🔔 Someone wants to chat!\n⏰ ${new Date().toLocaleString()}`,
                        parse_mode: 'HTML'
                    })
                }
            );
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
}