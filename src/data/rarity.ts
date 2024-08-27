import { Client } from "src";
import { RawRarity } from "src/data.types";

export enum AnimationType {
    None = "none",
    Uncommon = "uncommon",
    Rare = "rare",
    Epic = "epic",
    Legendary = "legendary",
    Chroma = "chroma",
    Mystical = "mystical",
    Iridescent = "iridescent"
}

export default class Rarity implements RawRarity {
    public readonly name: string;
    public readonly color: string;
    public readonly animation: AnimationType;
    public readonly exp: number;
    public readonly wait: number;
    public readonly client: Client;

    constructor(data: RawRarity, name: string, client: Client) {
        this.client = client;
        this.name = name;
        this.color = data.color;
        this.animation = AnimationType[data.animation];
        this.exp = data.exp;
        this.wait = data.wait;
    }

    /**
     * getBlooks - Get the blooks with this rarity.
     * @returns {Blook[]}
     */
    public getBlooks() {
        return Array.from(this.client.dataManager.getBlooks()).filter((blook) => blook.rarity.name === this.name);
    }
}