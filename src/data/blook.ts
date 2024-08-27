import { RawBlook } from "src/data.types";
import Rarity from "./rarity";
import { endpoints } from "src/consts";
import { Client } from "src";
import Pack from "./pack";

export enum Day {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}

export default class Blook {
    public readonly name: string;
    public readonly image: string;
    public readonly rarity: Rarity;
    public pack: Pack;
    public readonly chance: number;
    public readonly price: number;
    public readonly art: string;
    public readonly bazaarMaximumListingPrice?: number | null;
    public readonly bazaarMinimumListingPrice?: number | null;
    public readonly onlyOnDay?: Day | null;
    public readonly client: Client;

    constructor(data: RawBlook, name: string, client: Client) {
        this.client = client;
        this.name = name;
        this.image = data.image;
        this.rarity = this.client.dataManager.getRarity(data.rarity);
        this.chance = data.chance;
        this.price = data.price;
        this.art = data.art;
        this.bazaarMaximumListingPrice = data.bazaarMaximumListingPrice;
        this.bazaarMinimumListingPrice = data.bazaarMinimumListingPrice;
        this.onlyOnDay = data.onlyOnDay;
    }

    /**
     * _setPack - DO NOT USE THIS METHOD!!!
     * 
     */
    public async _setPack(pack: Pack) {
        this.pack = pack;
    }

    /**
     * getImageUrl - Get the full URL of the blook image.
     * @returns {String}
     */
    public getImageUrl(): string {
        return `https://blacket.org${this.image}`;
    }

    /**
     * getArtUrl - Get the full URL of the blook art.
     * @returns {String}
     */
    public getArtUrl() {
        return `https://blacket.org${this.art}`;
    }

    /**
     * isDay - Check if the blook is only available on a specific day
     * @param {Day} day - The day to check, defaults to the current day.
     * @returns {Boolean}
     */
    public isDay(day: Day = new Date().getDay()): boolean {
        if (!this.onlyOnDay) return true;

        return this.onlyOnDay === day;
    }

    /**
     * getBlookEmoji - Get the emoji for the blook.
     * ```ts
     * const blook = client.dataManager.getBlook("zastix");
     * console.log(blook.getBlookEmoji()); // -> [zastix]
     * ````
     * @returns {String}
     */
    public getBlookEmoji() {
        return `[${this.name}]`;
    }

    /**
     * canListAt - Check if the blook can be listed at a specific price
     * @param {Number} price - The price to check
     * @returns {Boolean}
     */
    public canListAt(price: number): boolean {
        if (!this.bazaarMinimumListingPrice || !this.bazaarMaximumListingPrice) return true;

        return price >= this.bazaarMinimumListingPrice && price <= this.bazaarMaximumListingPrice;
    }

    /**
     * sell - Sell an amount of this blook
     * @param {Number} quantity The quantity of blooks to sell
     * @param {Boolean=} force  Whether to force refetch the quanity from the API
     * @returns {Promise<void>}
     */
    public async sell(quantity: number, force: boolean = false): Promise<void> {
        const qBefore = await this.getQuantity(force);
        if (qBefore < quantity) throw new Error("You don't have enough blooks to sell.\nTry passing true as the second argument to force the quantity to refetch.");

        const { data } = await this.pack.client.axiosInstace.post(endpoints.market.sell, { blook: this.name, quantity });

        if (data.error) throw new Error(data.reason);

        (await this.client.userManager.getMe()).blooks.set(this.name, qBefore - quantity);
    }

    /**
     * getQuantity - Get the quantity you have of this blook
     * @param {Boolean=} force Whether to force refetch the quanity from the API
     * @returns {Promise<Number>}
     */
    public async getQuantity(force: boolean = false): Promise<number> {
        const me = await this.client.userManager.getMe(force);

        return me.blooks.get(this.name) || 0;
    }
}