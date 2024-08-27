import { endpoints, items, type Client } from ".";
import { RawData } from "./data.types";
// import Badge from "./data/badge";
// import Banner from "./data/banner";
// import Blook from "./data/blook";
// import Booster from "./data/booster";
// import Config from "./data/config";
// import Credit from "./data/credit";
// import Emoji from "./data/emoji";
// import Item from "./data/item";
// import Pack from "./data/pack";
// import Rarity from "./data/rarity";
// import WeeklyShopItem from "./data/weekly";
import { Badge, Banner, Blook, Booster, Config, Credit, Emoji, Item, Pack, Rarity, WeeklyShopItem } from "./data/";

export default class DataManager {
    private badges: Map<string, Badge> = new Map();
    private blooks: Map<string, Blook> = new Map();
    private banners: Map<string, Banner> = new Map();
    private credits: Credit[] = [];
    private emojis: Map<string, Emoji> = new Map();
    private packs: Map<string, Pack> = new Map();
    private rarities: Map<string, Rarity> = new Map();
    private weeklyShop: Map<string, WeeklyShopItem> = new Map();
    private items: Map<string, Item> = new Map();
    private config: Config;
    private booster: Booster;
    public inited: boolean = false;
    public readonly client: Client;

    constructor(client: Client) {
        this.client = client;

        for (const item of Object.entries(items)) {
            this.items.set(item[0], new Item(item[1], item[0], this.client));
        }
    }

    public async init() {
        if (this.inited) return;
        this.inited = true;
        this.client.axiosInstace.get(endpoints.data).then(async (res) => {
            const data = res.data as RawData;
            this.config = new Config(data.config, this.client);
            this.booster = new Booster(res.data.booster, this.client);
            await this.booster.init();

            for (const badge of Object.entries(data.badges)) {
                this.badges.set(badge[0], new Badge(badge[1], badge[0]));
            }

            for (const rarity of Object.entries(data.rarities)) {
                this.rarities.set(rarity[0], new Rarity(rarity[1], rarity[0], this.client));
            }

            for (const blook of Object.entries(data.blooks)) {
                this.blooks.set(blook[0], new Blook(blook[1], blook[0], this.client));
            }

            for (const banner of Object.entries(data.banners)) {
                this.banners.set(banner[0], new Banner(banner[1], banner[0]));
            }

            for (const credit of data.credits) {
                this.credits.push(new Credit(credit, this.client));
            }

            for (const emoji of Object.entries(data.emojis)) {
                this.emojis.set(emoji[0], new Emoji(emoji[1], emoji[0]));
            }

            for (const pack of Object.entries(data.packs)) {
                this.packs.set(pack[0], new Pack(pack[1], pack[0], this.client));
            }

            for (const item of Object.entries(data.weekly_shop)) {
                this.weeklyShop.set(item[0], new WeeklyShopItem(item[1], item[0], this.client));
            }
        });
    }

    /**
     * getConfig - Get the game's config.
     * @returns {Config}
     */
    public getConfig() {
        return this.config;
    }

    /**
     * getBooster - Get the game's current active booster.
     * @returns {Promise<Booster>}
     */
    public async getBooster(force: boolean = false): Promise<Booster> {
        if (force) {
            const res = await this.client.axiosInstace.get(endpoints.data);
            const data = res.data as RawData;

            this.booster = new Booster(data.booster, this.client);
            await this.booster.init();
        }
        return this.booster;
    }

    /**
     * getBlooks - Get all blooks.
     * @returns {Blook[]}
     */
    public getBlooks() {
        return Array.from(this.blooks.values());
    }

    /**
     * getBlook - Get a blook by its name.
     * @param {String} name
     * @returns {Blook}
     */
    public getBlook(name: string) {
        return this.blooks.get(name);
    }

    /**
     * getBadges - Get all badges.
     * @returns {Badge[]}
     */
    public getBadges() {
        return Array.from(this.badges.values());
    }

    /**
     * getBadge - Get a badge by its name.
     * @param {String} name
     * @returns {Badge}
     */
    public getBadge(name: string) {
        return this.badges.get(name);
    }

    /**
     * getBanners - Get all banners.
     * @returns {Banner[]}
     */
    public getBanners() {
        return Array.from(this.banners.values());
    }

    /**
     * getBanner - Get a banner by its name.
     * @param {String} name
     * @returns {Banner}
     */
    public getBanner(name: string) {
        return this.banners.get(name);
    }

    /**
     * getCredits - Get all credits.
     * @returns {Credit[]}
     */
    public getCredits() {
        return this.credits;
    }

    /**
     * getEmojis - Get all emojis.
     * @returns {Emoji[]}
     */
    public getEmojis() {
        return Array.from(this.emojis.values());
    }

    /**
     * getEmoji - Get an emoji by its name.
     * @param {String} name
     * @returns {Emoji}
     */
    public getEmoji(name: string) {
        return this.emojis.get(name);
    }

    /**
     * getPacks - Get all packs.
     * @returns {Pack[]}
     */
    public getPacks() {
        return Array.from(this.packs.values());
    }

    /**
     * getPack - Get a pack by its name.
     * @param {String} name
     * @returns {Pack}
     */
    public getPack(name: string) {
        return this.packs.get(name);
    }

    /**
     * getRarities - Get all rarities.
     * @returns {Rarity[]}
     */
    public getRarities() {
        return Array.from(this.rarities.values());
    }

    /**
     * getRarity - Get a rarity by its name.
     * @param {String} name
     * @returns {Rarity}
     */
    public getRarity(name: string) {
        return this.rarities.get(name);
    }

    /**
     * getItems - Get all items.
     * @returns {Item[]}
     */
    public getItems() {
        return Array.from(this.items.values());
    }

    /**
     * getItem - Get an item by its name.
     * @param {String} name
     * @returns {Item}
     */
    public getItem(name: string) {
        return this.items.get(name);
    }

    /**
     * getWeeklyShop - Get all weekly shop items.
     * @returns {WeeklyShopItem[]}
     */
    public getWeeklyShop() {
        return Array.from(this.weeklyShop.values());
    }

    /**
     * getWeeklyShopItem - Get a weekly shop item by its name.
     * @param {String} name
     * @returns {WeeklyShopItem}
     */
    public getWeeklyShopItem(name: string) {
        return this.weeklyShop.get(name);
    }
}