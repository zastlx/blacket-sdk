import { Client, SocketEvents } from "src";
import { RawBooster } from "src/data.types";
import { User } from "src/user";

export default class Booster {
    public inited: boolean = false;
    public active: boolean;
    public multiplier: number;
    public time: number;
    public user: User;
    public client: Client;
    private _user: RawBooster["user"];

    constructor(data: RawBooster, client: Client) {
        this.client = client;
        this.active = data.active;
        this.multiplier = data.multiplier;
        this.time = data.time;

        // lazy loaded
        // this.client.userManager.fetchUser(data.user.id).then((user) => this.user = user);
        this._user = data.user;

        if (this.active) setTimeout(() => this.active = false, this.time);
        this.client.socket.on(SocketEvents.NOTIFICATION, async (data) => {
            if (data.title !== "Booster") return;

            const booster = await this.client.dataManager.getBooster(true)
            this.active = booster.active;
            this.multiplier = booster.multiplier;
            this.time = booster.time;
            this.inited = false;
            await this.init();

            if (this.active)
                setTimeout(() => this.active = false, this.time);
        });
    }

    public async init(): Promise<void> {
        if (this.inited) return;
        this.inited = true;

        if (!this._user) return;
        this.user = await this.client.userManager.fetchUser(this._user.id);
    }
}