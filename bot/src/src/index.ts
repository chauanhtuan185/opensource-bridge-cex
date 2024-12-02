import { websocketStreamClient } from './binanceClient';
import { startBot } from './bot';
import * as dotenv from 'dotenv';
dotenv.config();
// Start WebSocket connection
websocketStreamClient.userData('YOUR_LISTEN_KEY');

// Start Telegram Bot
startBot();
