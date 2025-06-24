const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot is ready!');
});

// Endpoint para recibir mensajes desde n8n
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    const chatId = number + '@c.us';
    try {
        await client.sendMessage(chatId, message);
        res.send({ status: 'Mensaje enviado' });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).send({ error: 'No se pudo enviar el mensaje' });
    }
});

client.initialize();

app.listen(3000, () => {
    console.log('🚀 Servidor Express escuchando en puerto 3000');
});