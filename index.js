const PATH = '/home/jason/go/bin/rly';

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

let rlyProcess;
const isWindows = os.platform() === "win32";
if (isWindows) {
    // rlyProcess = spawn('wsl', ['/home/jason/go/bin/rly', 'config','osmosis-cosmoshub']);
    rlyProcess = spawn('wsl', ['ping', '8.8.8.8']);
}
else {
    rlyProcess = spawn('rly', ['start']);
    // rlyProcess = spawn('ping', ['8.8.8.8']);
}


// relayer stdout handler
rlyProcess.stdout.on('data', (data) => {
    console.log(`wss:${data}`);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data.toString());
        }
    });
});


// log the relayer stdout to an emulated console
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
