const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js'); // Updated import
const http = require('http');
const socketIo = require('socket.io');

// Set up the bot client with correct intents for discord.js v14
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // For reading message content
    ],
});

// Create an Express server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Bot login with your bot token (DO NOT SHARE THIS PUBLICLY)
const botToken = 'MTE1NTU5Nzc2MTE5OTIyNjkzMg.GmZOJW.gy7qyrnNC4W-bdKoBYkuZ7uffN5E0gd2rzOOZE';  // Replace with your bot token
client.login(botToken);

// When the bot is logged in and ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Listen for messages on Discord and send them to the website
client.on('messageCreate', (message) => {
    if (message.author.bot) return;  // Ignore bot messages
    io.emit('message', {
        username: message.author.username,
        content: message.content
    });
});

// Set up Socket.IO connection for communication with website
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming messages from the website
    socket.on('sendMessage', (message) => {
        // Send the message to Discord
        client.channels.cache.get('1313182911419252868').send(message);  // Replace with your channel ID
        console.log(`Message sent to Discord: ${message}`);
    });
});

// Serve the static website (you can use your HTML here)
app.use(express.static('public'));

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
