import { Spot, WebsocketStream } from '@binance/connector-typescript';
import * as dotenv from 'dotenv';
export enum Side {
    SELL = 'SELL',
    BUY = 'BUY',
}

export enum OrderType {
    LIMIT = 'LIMIT',
    MARKET = 'MARKET',
    STOP_LOSS = 'STOP_LOSS',
    STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
    TAKE_PROFIT = 'TAKE_PROFIT',
    TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
    LIMIT_MAKER = 'LIMIT_MAKER',
}

export const client = new Spot(
    process.env.BINANCE_API_KEY || '',
    process.env.BINANCE_API_SECRET || '',
    { baseURL: 'https://api.binance.com' }
);

export const websocketStreamClient = new WebsocketStream({
    callbacks: {
        open: () => console.debug('Connected to WebSocket server'),
        close: () => console.debug('Disconnected from WebSocket server'),
        message: (data: string) => handleServerMessage(data),
    },
});

const handleServerMessage = (data: string) => {
    try {
        const parsedData = JSON.parse(data);
        const eventType = parsedData.e;

        if (eventHandlers[eventType]) {
            eventHandlers[eventType](parsedData);
        } else {
            console.warn(`Unknown event type: ${eventType}`, parsedData);
        }
    } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
    }
};

const handleBalanceUpdate = async (data: any) => {
    try {
        const sellOrderResponse = await client.newOrder('ALGOUSDT', Side.SELL, OrderType.MARKET, {
            quantity: parseFloat(data.d),
        });

        console.log('Sell Order Response:', sellOrderResponse);

        if (sellOrderResponse.cummulativeQuoteQty) {
            await client.newOrder('KAIAUSDT', Side.BUY, OrderType.MARKET, {
                quoteOrderQty: parseFloat(sellOrderResponse.cummulativeQuoteQty),
            });
        }
    } catch (error) {
        console.error('Order Error:', error);
    }
};

const eventHandlers: Record<string, (data: any) => void> = {
    balanceUpdate: handleBalanceUpdate,
};
