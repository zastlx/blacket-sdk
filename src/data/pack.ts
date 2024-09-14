import { RawPack } from "../data.types";
import Blook from "./blook";
import { Client, endpoints } from "..";

export default class Pack {
    public readonly name: string;
    public readonly image: string;
    public readonly price: number;
    public readonly color1: string;
    public readonly color2: string;
    public readonly hidden: boolean;
    public readonly blooks: Map<string, Blook>;
    public readonly client: Client;


    constructor(data: RawPack, name: string, client: Client) {
        this.client = client;
        this.name = name;
        this.image = data.image;
        this.price = data.price;
        this.color1 = data.color1;
        this.color2 = data.color2;
        this.hidden = data.hidden;
        this.blooks = new Map();

        for (const blook of data.blooks) {
            const blookK = this.client.dataManager.getBlook(blook);
            blookK._setPack(this);
            this.blooks.set(blook, blookK);
        }
    }

    /**
     * getUrl - Get the full URL of the pack image.
     * @returns {String}
     */
    public getUrl() {
        return `https://blacket.org${this.image}`;
    }

    /**
     * getBlooks - Get the blooks in this pack.
     * @returns {Array<Blook>}
     */
    public getBlooks(): Blook[] {
        return Array.from(this.blooks.values());
    }

    public async open(): Promise<Blook> {
        const { data } = await this.client.axiosInstace.post(endpoints.market.open, { pack: this.name });
        if (data.error) throw new Error(data.reason);

        return this.client.dataManager.getBlook(data.blook);
    }
}