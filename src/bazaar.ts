import { Blook, endpoints, Item, User, type Client } from ".";
import { Clan } from "./clan";

/*{
    "id": 2136598,
    "item": "Shamrock",
    "price": 639,
    "seller": "oreosNcream",
    "date": 1743083169
}*/
interface RawBazaarListing {
    id: number;
    item: string;
    price: number;
    seller: string;
    date: number;
}

export class BazaarListing {
    public inited: boolean = false;
    public readonly id: number;
    public readonly item: Blook | Item;
    public seller: User;
    public readonly price: number;
    public readonly date: Date;

    private readonly _seller: string;
    protected readonly client: Client;

    constructor(client: Client, data: RawBazaarListing) {
        this.client = client;
        this.id = data.id;
        this.item = client.dataManager.getBlook(data.item) ?? client.dataManager.getItem(data.item);
        this.price = data.price;
        this._seller = data.seller;
        this.date = new Date(data.date * 1000);
    }

    public async init(): Promise<void> {
        if (this.inited) return;
        this.inited = true;
        this.seller = await this.client.userManager.fetchUser(this._seller);
    }

    /**
     * buy - Buy the item from the bazaar listing.
     * @returns {Promise<Blook | Item} The bought item.
     * @throws {Error} If the purchase fails.
     */
    public async buy(): Promise<Blook | Item> {
        if (!this.inited) throw new Error("BazaarListing has not been initied yet");
        if (this.seller.id === this.client.user.id) throw new Error("You cannot buy your own listing");

        const { data } = await this.client.axiosInstace.post(endpoints.bazaar.buy, { id: this.id });

        if (data.error) throw new Error(data.reason);

        return this.item;
    }

    /**
     * remove - Remove the listing from the bazaar.
     * @returns {Promise<void>}
     * @throws {Error} If the removal fails.
     */
    public async remove(): Promise<void> {
        if (!this.inited) throw new Error("BazaarListing has not been initied yet");
        if (this.seller.id !== this.client.user.id) throw new Error("You cannot remove someone else's listing");

        const { data } = await this.client.axiosInstace.post(endpoints.bazaar.remove, { id: this.id });
        if (data.error) throw new Error(data.reason);
    }
}

export default class BazaarManager {
    public initied: boolean = false;
    private readonly listings: Map<number, BazaarListing> = new Map();
    public readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async init() {
        this.initied = true;
    }

    private async _getListing(query?: string): Promise<BazaarListing[]> {
        if (!this.initied) throw new Error("BazaarManager has not been initied yet");

        const { data } = await this.client.axiosInstace.get(endpoints.bazaar.search(query));
        if (data.error) throw new Error(data.reason);

        const listings = await Promise.all((data.listings as RawBazaarListing[]).map(async (listing: RawBazaarListing) => {
            const bazaarListing = new BazaarListing(this.client, listing);
            await bazaarListing.init();
            this.setListing(listing.id, bazaarListing);
            return bazaarListing;
        }));

        return listings;
    }

    public async setListing(listingId: number, listing: BazaarListing): Promise<void> {
        if (!this.initied) throw new Error("BazaarManager has not been initied yet");

        if (this.listings.has(listingId)) {
            const existingListing = this.listings.get(listingId);
            if (existingListing) await existingListing.remove();
        }

        this.listings.set(listingId, listing);
    }

    public async getListing(userOrListingId: number): Promise<BazaarListing | undefined> {
        if (!this.initied) throw new Error("BazaarManager has not been initied yet");

        if (this.listings.has(userOrListingId)) return this.listings.get(userOrListingId);

        const listings = await this._getListing(userOrListingId.toString());

        return listings.find((listing: BazaarListing) => listing.id === userOrListingId);
    }

    public async getListings(query?: string): Promise<BazaarListing[]> {
        if (!this.initied) throw new Error("BazaarManager has not been initied yet");

        return await this._getListing(query);
    }
}