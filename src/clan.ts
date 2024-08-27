import { endpoints, User, type Client } from ".";

export interface RawClan {
    id: number;
    name: string;
    description: string;
    color: string;
    image: string;
    created: number;
    exp: number;
    owner: RawClanOwner;
    members: RawClanOwner[];
    safe: boolean;
    online: number;
    offline: number;
    sent: boolean;
}

export interface RawClanOwner {
    id: number;
    username: string;
    color: string;
    avatar: string;
}

export class Clan implements RawClan {
    public inited: boolean = false;
    public readonly id: number;
    public readonly name: string;
    public readonly description: string;
    public readonly color: string;
    public readonly image: string;
    public readonly created: number;
    public readonly exp: number;
    public owner: User;
    public members: User[] = [];
    public readonly online: number;
    public readonly offline: number;
    public readonly safe: boolean;
    public readonly sent: boolean;
    public readonly client: Client;
    private _owner: RawClanOwner;
    private _members: RawClanOwner[];

    constructor(data: RawClan, client: Client) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.color = data.color;
        this.image = data.image;
        this.created = data.created;
        this.exp = data.exp;
        this.safe = data.safe;
        this.online = data.online;
        this.offline = data.offline;
        this.sent = data.sent;
        /*
        this.owner = data.owner;
        this.members = data.members;*/

        // lazy loaded
        this._owner = data.owner;
        this._members = data.members
    }

    public async init(): Promise<void> {
        if (this.inited) return;
        this.inited = true;
        this.owner = await this.client.userManager.fetchUser(this._owner.id);
        this.members = await Promise.all(this._members.map(async (member) => await this.client.userManager.fetchUser(member.id)));
    }

    /**
     * attack - Attack a clan with a Fragment Grenade.
     */
    public async attack() {
        if (this.client.user.clan.id === this.id) throw new Error("You can't attack your own clan.");

        this.client.axiosInstace.post(endpoints.items.use, { item: "Fragment Grenade (Item)", clan: this.id });
    }

    // TODO: request to join method + disband + change stuff
}

export default class ClanManager {
    private readonly clans: Map<number, Clan> = new Map();
    public readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public getClan(id: number): Clan {
        return this.clans.get(id);
    }

    public async fetchClan(id: number, force: boolean = false): Promise<Clan> {
        if (this.clans.has(id) && !force) return this.clans.get(id);

        const { data } = await this.client.axiosInstace.get(endpoints.clans.get(id));

        if (data.error && data.reason !== "Clan does not exist.") throw new Error(data.reason);
        if (data.error) return null;

        const clan = new Clan(data, this.client);
        this.clans.set(clan.id, clan);
        return clan;
    }
}