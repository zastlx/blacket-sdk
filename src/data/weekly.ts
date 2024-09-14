import { Client } from "..";
import { RawWeeklyShopItem } from "../data.types";
import Item from "./item";

export default class WeeklyShopItem implements RawWeeklyShopItem {
    public readonly name: string;
    public readonly price: number;
    public readonly glow: boolean;
    public readonly item: Item;
    public readonly client: Client;

    constructor(data: RawWeeklyShopItem, name: string, client: Client) {
        this.client = client;
        this.name = name;
        this.price = data.price;
        this.glow = data.glow;
        this.item = this.client.dataManager.getItem(this.name);
    }
}