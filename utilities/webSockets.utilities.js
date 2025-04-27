import { WebSocketServer } from 'ws';

const clientMap = new Map();
let wss = null;

export function webSocketSetup(server) {
    wss = new WebSocketServer({ server });
    wss.on("connection", (ws, req) => {
        console.log("Client connected");
        const url = new URL(req.url, `http://${req.headers.host}`);
        const guid = url.searchParams.get('guid');

        if (guid) {
            clientMap.set(guid, ws);

            ws.on('close', () => {
                clientMap.delete(guid);
            });
        }

        ws.send(JSON.stringify({ type: "welcome", message: "Welcome to the WebSocket server!" }));

        ws.on("message", (message) => {
            console.log(`Received: ${message}`);
        });
    });
}

export function getClientByGuid(guid) {
    return clientMap.get(guid);
}

export function webSocketCleanup() {
    if (wss) {
        wss.clients.forEach(client => client.terminate());
        wss.close(() => {
            console.log('WebSocket server closed');
        });
    }
}