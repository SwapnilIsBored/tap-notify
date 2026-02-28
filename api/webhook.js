export default async function handler(req, res) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const YOUR_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const FRIEND_CHAT_ID = process.env.FRIEND_CHAT_ID;
    
    // Handle button callbacks
    if (req.body.callback_query) {
        const callback = req.body.callback_query;
        const data = callback.data;
        const fromUser = callback.from.first_name;
        
        // Parse the callback data
        const [status, responderId] = data.split('_');
        
        let responseText;
        if (status === 'available') {
            responseText = `✅ ${fromUser} is available to chat!`;
        } else {
            responseText = `🚫 ${fromUser} is busy right now.`;
        }
        
        // Send response to BOTH users
        const chatIds = [YOUR_CHAT_ID, FRIEND_CHAT_ID];
        for (const chatId of chatIds) {
            await fetch(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: responseText,
                        parse_mode: 'HTML'
                    })
                }
            );
        }
        
        // Answer the callback to remove loading state
        await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    callback_query_id: callback.id,
                    text: 'Response sent!'
                })
            }
        );
    }
    
    res.status(200).json({ ok: true });
}