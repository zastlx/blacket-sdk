import { PrivateUser, type Client } from ".";
import { WebSocket, type MessageEvent } from "ws";
import { Message, type RawMessage } from "./message";

export enum SocketEvents {
    OPEN = "open",
    CLOSE = "close",
    MESSAGE_CREATE = "messages-create",
    MESSAGE_DELETE = "messages-delete",
    MESSAGE_EDIT = "messages-edit",
    MESSAGE_ACK = "messages-ack",
    NOTIFICATION = "notification",
    HEARTBEAT = "heartbeat"
};
export type SocketEventsType = keyof typeof SocketEvents;
export type OpenEvent = (client: Client) => void;
export type CloseEvent = () => void;
export type NotificationEvent = (data: { title: string, message: string, icon: string, time: number }) => void;

// Message Events
export type MessageCreateEvent = (message: Message) => void;
export type MessageDeleteEvent = (data: { id: number, message?: Message }) => void;
export type MessageEditEvent = (data: { id: number, message?: Message }) => void;
export type MessageAckEvent = (data: { customKey: string, message: Message }) => void;

export interface Events {
    [SocketEvents.OPEN]: Set<OpenEvent>;
    [SocketEvents.CLOSE]: Set<CloseEvent>;

    // Message Events
    [SocketEvents.MESSAGE_CREATE]: Set<MessageCreateEvent>;
    [SocketEvents.MESSAGE_DELETE]: Set<MessageDeleteEvent>;
    [SocketEvents.MESSAGE_EDIT]: Set<MessageEditEvent>;
    [SocketEvents.MESSAGE_ACK]: Set<MessageAckEvent>;

    [SocketEvents.NOTIFICATION]: Set<NotificationEvent>;

    [SocketEvents.HEARTBEAT]: Set<Function>;
};
export interface SocketMessage {
    error: boolean;
    event: SocketEvents;
    data: any;
}
export interface NotificationSocketMessage extends SocketMessage {
    event: SocketEvents.NOTIFICATION;
    data: { title: string, message: string, icon: string, time: number };
};
export interface MessageCreateSocketMessage extends SocketMessage {
    event: SocketEvents.MESSAGE_CREATE;
    data: RawMessage;
};

export interface MessageDeleteSocketMessage extends SocketMessage {
    event: SocketEvents.MESSAGE_DELETE;
    data: { id: number, room: number };
};
export interface MessageEditSocketMessage extends SocketMessage {
    event: SocketEvents.MESSAGE_EDIT;
    data: { content: string, room: number, message: number };
};
export interface MessageAckSocketMessage extends SocketMessage {
    event: SocketEvents.MESSAGE_ACK;
    data: RawMessage;
    customKey: string;
};

export class Socket {
    private instance: WebSocket;
    public readonly client: Client;
    private readonly events: Events;
    private _reconnectAttempts: number;
    private heartBeatTimeout: Timer;

    constructor(client: Client) {
        this.events = {
            [SocketEvents.OPEN]: new Set(),
            [SocketEvents.CLOSE]: new Set(),

            [SocketEvents.MESSAGE_CREATE]: new Set(),
            [SocketEvents.MESSAGE_DELETE]: new Set(),
            [SocketEvents.MESSAGE_EDIT]: new Set(),
            [SocketEvents.MESSAGE_ACK]: new Set(),

            [SocketEvents.NOTIFICATION]: new Set(),

            [SocketEvents.HEARTBEAT]: new Set()
        };
        this.client = client;
        this.setup();
    };

    private setup() {
        this.instance = new WebSocket("wss://blacket.org/worker/socket", {
            headers: {
                cookie: `token=${this.client.token};`
            }
        });

        this.instance.addEventListener("open", async () => {
            if (!this.client.userManager.initied) await this.client.userManager.init();
            if (!this.client.dataManager.inited) await this.client.dataManager.init();

            this.events[SocketEvents.OPEN].forEach((callback) => callback(this.client));


            this.instance.addEventListener("close", () => this.events[SocketEvents.CLOSE].forEach((callback) => callback()));
            this.instance.addEventListener("message", (event) => this._handleMessage(event));

            this.instance.addEventListener("close", () => {
                if (!this.client.config.reconnect || this._reconnectAttempts >= this.client.config.reconnectAttempts) return;

                this._reconnect();
            });
        });
    }

    private _reconnect() {
        this._reconnectAttempts++;
        setTimeout(() => {
            this.setup();
        }, this.client.config.reconnectTime);
    }

    private async _handleMessage(event: MessageEvent) {
        try {
            var data = JSON.parse(event.data.toString());
        } catch { }

        if (data.error) {
            if (process.env.NODE_ENV === "development") console.error(data);

            return;
        }

        switch (data.event) {
            case SocketEvents.MESSAGE_CREATE: {
                const createdMessage = new Message(data.data, this.client);
                await createdMessage.init();
                const message = this.client.messageManager.addMessage(createdMessage);
                message.edits.push(message.content);
                message.currentEdit = message.edits.length - 1;

                this.events[SocketEvents.MESSAGE_CREATE].forEach((callback) => callback(message));
                break;
            }
            case SocketEvents.MESSAGE_DELETE: {
                const message = this.client.messageManager.getMessage(data.data.message);
                if (!message) return;

                message.deleted = true;
                this.events[SocketEvents.MESSAGE_DELETE].forEach((callback) => callback({
                    id: message.id,
                    message
                }));
                break;
            }
            case SocketEvents.MESSAGE_EDIT: {
                const message = this.client.messageManager.getMessage(data.data.message);
                if (!message) return;

                message.edited = true;
                message.content = data.data.content;
                message.edits.push(message.content);
                message.currentEdit = message.edits.length - 1;

                this.events[SocketEvents.MESSAGE_EDIT].forEach((callback) => callback({
                    id: message.id,
                    message
                }));
                break;
            }
            case SocketEvents.MESSAGE_ACK: {
                this.events[SocketEvents.MESSAGE_ACK].forEach((callback) => callback({
                    customKey: data.customKey,
                    message: this.client.messageManager.getMessage(data.data.id)
                }));
                break;
            }
            case SocketEvents.HEARTBEAT: {
                if (this.heartBeatTimeout) clearTimeout(this.heartBeatTimeout);
                this.instance.send(JSON.stringify({ event: SocketEvents.HEARTBEAT }));

                this.heartBeatTimeout = setTimeout(() => {
                    this.instance.close();
                }, 30000);

                this.events[SocketEvents.HEARTBEAT].forEach((callback) => callback());
                break;
            }
        }
    }

    public on(event: SocketEvents.OPEN, callback: OpenEvent): void;
    public on(event: SocketEvents.CLOSE, callback: CloseEvent): void;
    public on(event: SocketEvents.MESSAGE_CREATE, callback: MessageCreateEvent): void;
    public on(event: SocketEvents.MESSAGE_DELETE, callback: MessageDeleteEvent): void;
    public on(event: SocketEvents.MESSAGE_EDIT, callback: MessageEditEvent): void;
    public on(event: SocketEvents.MESSAGE_ACK, callback: MessageAckEvent): void;
    public on(event: SocketEvents.NOTIFICATION, callback: NotificationEvent): void;
    public on(event: SocketEvents.HEARTBEAT, callback: CloseEvent): void;
    public on(event: SocketEvents, callback: Function) {
        if (!this.events[event]) throw new Error(`Event ${event} does not exist`);
        // @ts-expect-error - FIXME: if anyone knows how to fix this, lmk
        this.events[event].add(callback);
    }

    public off(event: SocketEvents.OPEN, callback: OpenEvent): void;
    public off(event: SocketEvents.CLOSE, callback: CloseEvent): void;
    public off(event: SocketEvents.MESSAGE_CREATE, callback: MessageCreateEvent): void;
    public off(event: SocketEvents.MESSAGE_EDIT, callback: MessageEditEvent): void;
    public off(event: SocketEvents.MESSAGE_ACK, callback: MessageAckEvent): void;
    public off(event: SocketEvents.NOTIFICATION, callback: NotificationEvent): void;
    public off(event: SocketEvents.HEARTBEAT, callback: CloseEvent): void;
    public off(event: SocketEvents, callback: Function) {
        if (!this.events[event]) throw new Error(`Event ${event} does not exist`);
        // @ts-expect-error - FIXME: if anyone knows how to fix this, lmk
        this.events[event].delete(callback);
    }

    public emit(event: SocketEvents, data: any) {
        this.instance.send(JSON.stringify({ event, data }));
    }
};
