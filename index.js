const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs' }),
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

client.on('message', async msg => {
    console.log(`📨 Mensaje recibido de ${msg.from}: "${msg.body}"`);

    if (msg.body.toLowerCase() === 'hola') {
        await msg.reply('¡Hola! Soy tu bot 🤖');
    }

    if (msg.body.toLowerCase() === 'quien eres') {
        await msg.reply('Soy el bot de pruebas de Sheen 🚀');
    }
});

// Endpoint para recibir mensajes desde n8n
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    const chatId = number + '@c.us';
    
    console.log('📥 Recibido:', { number, message });

    try {
        await client.sendMessage(chatId, message);
        console.log(`✅ Mensaje enviado a ${number}: "${message}"`);
        res.send({ status: 'Mensaje enviado' });
    } catch (error) {
        console.error('❌ Error al enviar:', error);
        res.status(500).send({ error: 'No se pudo enviar el mensaje' });
    }
});

// Endpoint para ver el status del bot
app.get('/status', async (req, res) => {
    res.json({
        connected: client.info !== undefined,
        info: client.info || 'Bot no está listo aún'
    });
});

client.initialize();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor Express escuchando en puerto ${PORT}`);
});
