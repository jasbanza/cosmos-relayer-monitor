
const commands = require('./commands.json').commands;

const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const os = require('os');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    // handle WebSocket connection here
    console.log('WebSocket connected');
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// start relayer
commands.forEach(command => {
    let process;
    const isWindows = os.platform() === "win32";
    if (isWindows) {
        process = spawn('wsl', [command.path, ...command.arguments]);
    }
    else {
        process = spawn(command.path, command.arguments);
    }

    // process stdout handler
    process.stdout.on('data', (data) => {
        console.log(data.toString());
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ stdout: data.toString(), info: command.info }));
            }
        });
    });

    // process stderr handler
    process.stderr.on('data', (data) => {
        console.log(data.toString());
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ stderr: data.toString(), info: command.info }));
            }
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
