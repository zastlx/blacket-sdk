import { getRandomText, Message, type Client } from ".";
import { SocketEvents } from "./socket";

export class Room {
    public readonly id: number;
    public readonly name: string;
    public readonly client: Client;
    private msgsWaitingForAck: Map<string, (customKey: string, message: Message) => void> = new Map();

    constructor(id: number, name: string, client: Client) {
        this.id = id;
        this.client = client;
        this.name = name;

        this.client.socket.on(SocketEvents.MESSAGE_ACK, (data) => {
            const callback = this.msgsWaitingForAck.get(data.customKey);
            if (!callback) return;
            if (!data.message) return;

            callback(data.customKey, this.client.messageManager.getMessage(data.message.id));
        });
    }

    /**
     * send - Send a message to the room.
     * @param {String} message - The content of the message.
     * @returns {Promise<Message>}
     */
    public async send(message: string): Promise<Message> {
        let customKey = await getRandomText(5);
        this.client.socket.emit(SocketEvents.MESSAGE_CREATE, {
            room: this.id,
            content: message,
            customKey
        });

        return new Promise((resolve) => {
            this.msgsWaitingForAck.set(customKey, (key, message) => {
                resolve(message);
                this.msgsWaitingForAck.delete(key);
            });
        });
    }
}

export default class RoomManager {
    private readonly rooms: Map<number, Room> = new Map();
    public readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.rooms.set(0, new Room(0, "global", this.client));
    }

    /**
     * getRoom - Get a room by its ID.
     * @param {Number} roomId - The ID of the room.
     * @returns {Room | undefined}
     */
    public getRoom(roomId: number): Room | undefined {
        return this.rooms.get(roomId);
    }

    /**
     * createRoom - Create a room.
     * @param {Number} id - The ID of the room.
     * @param {String} name - The name of the room.
     * @returns {Room}
     */
    public createRoom(id: number, name: string): Room {
        const room = new Room(id, name, this.client);
        this.rooms.set(id, room);
        return room;
    }

    /**
     * getOrCreateRoom - Get a room by its ID or create it if it doesn't exist.
     * @param {Number} id - The ID of the room.
     * @param {String} name - The name of the room to use if it doesn't exist.
     * @returns {Room}
     */
    public getOrCreateRoom(id: number, name: string): Room {
        return this.getRoom(id) || this.createRoom(id, name);
    }
}