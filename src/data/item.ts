import { Client, endpoints } from "..";
import { RawItem } from "../data.types";

export default class Item {
    public readonly name: string;
    public readonly description: string;
    public readonly image: string;
    public readonly price?: number;
    public readonly color: string;
    public readonly client: Client;

    constructor(data: RawItem, name: string, client: Client) {
        this.name = name;
        this.description = data.description;
        this.image = data.image;
        this.price = data.price;
        this.color = data.color;
        this.client = client;
    }

    /**
     * getUrl - Get the full URL of the item image.
     * @returns {String}
     */
    public getUrl() {
        return `https://blacket.org${this.image}`;
    }

    /**
     * use - Use the item.
     * @returns {Promise<String>}
     */
    public async use(): Promise<string> {
        const { data } = await this.client.axiosInstace.post(endpoints.items.use, { item: this.name });

        if (data.error) throw new Error(data.reason);

        return data.message;
    }
}