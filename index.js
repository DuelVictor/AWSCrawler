import { webSocketCleanup, webSocketSetup } from './utilities/webSockets.utilities.js';
import { app } from './app.js';
import http from 'http';
import dotenv from 'dotenv'

dotenv.config();

const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
const gracefulShutdown = (server) => {
    const shutdown = () => {
        server.close(() => {
            console.log('Server was shutdown successfully');
            process.exit(0);
        });
        webSocketCleanup?.();
    }
    for (const signal of signals) {
        process.once(signal, shutdown);
    }
};

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
    console.log('Server is running on port:', PORT);
    signals.forEach(() => gracefulShutdown(server));
});

webSocketSetup(server);