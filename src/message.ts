import { getRandomText, RawMessageClan, User, type Client } from ".";
import { endpoints } from "./consts";
import { Room } from "./room";
import { SocketEvents, type MessageDeleteSocketMessage } from "./socket";

export interface RawMessage {
    message: RawMessageData;
    author: RawAuthor;
    room: RawRoom;
}

export interface RawRoom {
    id: number;
    name: string;
}

export interface RawAuthor {
    id: number;
    username: string;
    clan: RawMessageClan;
    role: string;
    avatar: string;
    banner: string;
    badges: string;
    color: string;
    exp: number;
    // TODO: write types for this
    permissions: string[];
}

export interface RawMessageData {
    id: number;
    user: number;
    room: number;
    content: string;
    mentions: any[];
    edited: boolean;
    deleted: boolean;
    date: number;
}

export class Message {
    public readonly client: Client;
    public readonly id: number;
    public edits: string[] = [];
    public currentEdit: number = 0;
    public content: string;
    public author: User;
    public readonly room: Room;
    public readonly date: Date;
    // user ids
    public readonly mentions: string[];
    public edited: boolean;
    public deleted: boolean;
    private waitingForAck: Map<string, (customKey: string, message: Message) => void> = new Map();
    private _author: RawAuthor

    constructor(data: RawMessage, client: Client) {
        this.client = client;
        this.id = data.message.id;
        this.content = data.message.content;
        this.edits.push(data.message.content);
        this.room = this.client.roomManager.getOrCreateRoom(data.room.id, data.room.name);
        this.date = new Date(data.message.date);
        this.mentions = data.message.mentions;
        this.edited = data.message.edited;
        this.deleted = data.message.deleted;

        this.client.socket.on(SocketEvents.MESSAGE_ACK, (data) => {
            const callback = this.waitingForAck.get(data.customKey);
            if (!callback) return;

            callback(data.customKey, this.client.messageManager.getMessage(data.message.id));
        });

        this._author = data.author;
    }

    public async init() {
        this.author = await this.client.userManager.fetchUser(this._author.id);
    }

    /**
     * reply - Reply to the message.
     * @param content The content of the message
     * @param bad If this is true, the message will be sent using Blacket's annoying "reply" system, if false, it will be sent by just mentioning the user and appending the content.
     * @returns {Promise<Message>}
     */
    public async reply(content: string, bad: boolean = false): Promise<Message> {
        const customKey = await getRandomText(5);
        this.client.socket.emit(SocketEvents.MESSAGE_CREATE, {
            room: this.room.id,
            content: bad ? `From <@${this.author.id}>: ${this.content}\n<@${this.author.id}> ${content}` : `<@${this.author.id}> ${content}`,
            customKey
        });

        return new Promise((resolve) => {
            this.waitingForAck.set(customKey, (key, message) => {
                resolve(message);
                this.waitingForAck.delete(key);
            });
        });
    }

    public async edit(content: string): Promise<void> {
        // TODO: finish this method + add a check to see if the user is the author of the message
        const { data } = await this.client.axiosInstace.post(endpoints.messages.edit(this.id), {
            content: content
        });
    }

    public async delete(): Promise<void> {
        await this.client.axiosInstace.post(endpoints.messages.delete(this.id));
    }
}

export default class MessageManager {
    public readonly client: Client;
    private readonly messages: Map<number, Message> = new Map();

    constructor(client: Client) {
        this.client = client;
    }

    public addMessage(data: Message): Message {
        this.messages.set(data.id, data);

        return data;
    }

    public getMessage(id: number): Message | undefined {
        return this.messages.get(id);
    }
}