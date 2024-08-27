import { endpoints, type Client } from ".";
import { Clan } from "./clan";

export interface RawUser {
    id: number;
    username: string;
    created: number;
    modified: number;
    avatar: string;
    banner: string;
    badges: string[];
    blooks: { [key: string]: number };
    tokens: number;
    clan: RawMessageClan;
    role: string;
    color: string;
    exp: number;
    mute: RawMute;
    ban: RawBan;
    misc: RawMisc;
    friends: number[];
}

export interface RawPrivateUser extends RawUser {
    otp: boolean;
    moneySpent: number;
    settings: RawSettings;
    blocks: number[];
    claimed: string;
    inventory: string[];
    perms: string[];
}

export interface RawSettings {
    friends: string;
    requests: string;
}

export interface RawMisc {
    opened: number;
    messages: number;
}

export interface RawBan {
    banned: boolean;
    staff: string;
    reason: string;
    time: number;
}

export interface RawMute {
    muted: boolean;
    staff?: any;
    reason?: any;
}

export interface RawMessageClan {
    id: string;
    name: string;
    color: string;
    room: number;
}

export enum UserBadge {
    SixMonthVeteran = "6 Month Veteran",
    TweleveMonthVeteran = "12 Month Veteran",
    EighteenMonthVeteran = "18 Month Veteran",
    TwentyFourMonthVeteran = "24 Month Veteran",
    Artist = "Artist",
    BigSpender = "Big Spender",
    Blacktuber = "Blacktuber",
    Booster = "Booster",
    CoOwner = "Co-Owner",
    Developer = "Developer",
    FullOfLard = "full of lard",
    FullOfToken = "full of token",
    Kangooro = "kangooro",
    LegacyAnkh = "Legacy Ankh",
    OG = "OG",
    Owner = "Owner",
    Plus = "Plus",
    Staff = "Staff",
    Tester = "Tester",
    Verified = "Verified",
    VerifiedBot = "Verified Bot"
}

export class User {
    public inited: boolean = false;
    protected readonly client: Client;
    public readonly id: number;
    public readonly username: string;
    public readonly created: Date;
    public readonly modified: Date;
    public readonly avatar: string;
    public readonly banner: string;
    public readonly badges: UserBadge[];
    public readonly blooks: Map<string, number>;
    public readonly tokens: number;
    public clan?: Clan;
    public readonly role: string;
    public readonly color: string;
    public readonly exp: number;
    public readonly mute: RawMute;
    public readonly ban: RawBan;
    public readonly misc: RawMisc;
    public friends: User[];
    private readonly _friends: number[] = [];
    private readonly _clan: RawMessageClan;

    constructor(client: Client, data: RawUser) {
        this.client = client;
        this.id = data.id;
        this.username = data.username;
        this.created = new Date(data.created);
        this.modified = new Date(data.modified);
        this.avatar = data.avatar;
        this.banner = data.banner;
        this.badges = data.badges as UserBadge[];
        this.blooks = new Map(Object.entries(data.blooks));
        this.tokens = data.tokens;
        this.role = data.role;
        this.color = data.color;
        this.exp = data.exp;
        this.mute = data.mute;
        this.ban = data.ban;
        this.misc = data.misc;
        this._clan = data.clan;
        this._friends = data.friends;
    }

    public async init(): Promise<void> {
        if (this.inited) return;
        this.inited = true;
        if (this._clan) {
            this.clan = await this.client.clanManager.fetchClan(parseInt(this._clan.id));
            await this.clan.init();
        }

        this.friends = await Promise.all(this._friends.map(async (id) => await this.client.userManager.fetchUser(id)));
    }

    /**
     * getAvatarUrl - Get the full URL of the user's avatar.
     * @returns {String}
     */
    public getAvatarUrl(): string {
        return this.avatar.startsWith("http") ? this.avatar : `https://blacket.org${this.avatar}`;
    }

    /**
     * getBannerUrl - Get the full URL of the user's banner.
     */
    public getBannerUrl(): string {
        return this.banner.startsWith("http") ? this.banner : `https://blacket.org${this.banner}`;
    }

    /**
     * isMuted - Check if the user is muted.
     * @returns {Boolean}
     */
    public isMuted(): boolean {
        return this.mute.muted;
    }

    /**
     * isBanned - Check if the user is banned.
     * @returns {Boolean}
     */
    public isBanned(): boolean {
        return this.ban.banned;
    }

    /**
     * isStaff - Check if the user is staff.
     * @returns {Boolean}
     */
    public isStaff(): boolean {
        return this.badges.includes(UserBadge.Staff);
    }

    /**
     * isTester - Check if the user is a tester.
     * @returns {Boolean}
     */
    public isTester(): boolean {
        return this.badges.includes(UserBadge.Tester);
    }

    /**
     * isDeveloper - Check if the user is a developer.
     * @returns {Boolean}
     */
    public isDeveloper(): boolean {
        return this.badges.includes(UserBadge.Developer);
    }

    /**
     * isVerified - Check if the user is verified.
     * @returns {Boolean}
     */
    public isVerified(): boolean {
        return this.badges.includes(UserBadge.Verified);
    }

    /**
     * isPlus - Check if the user has Plus.
     * @returns {Boolean}
     */
    public isPlus(): boolean {
        return this.badges.includes(UserBadge.Plus);
    }

    /**
     * isOwner - Check if the user is an owner or co-owner.
     * @returns {Boolean}
     */
    public isOwner(): boolean {
        return this.badges.includes(UserBadge.Owner) || this.badges.includes(UserBadge.CoOwner);
    }

    /**
     * getVeteranLevel - Get the user's veteran level.
     * @returns {Number}
     */
    public getVeteranLevel(): number {
        if (this.badges.includes(UserBadge.TweleveMonthVeteran)) return 12;
        if (this.badges.includes(UserBadge.EighteenMonthVeteran)) return 18;
        if (this.badges.includes(UserBadge.TwentyFourMonthVeteran)) return 24;
        return 6;
    }
}

export class PrivateUser extends User {
    public readonly otp: boolean;
    public readonly moneySpent: number;
    public readonly settings: RawSettings;
    public readonly blocks: number[];
    public readonly claimed: string;
    public readonly inventory: string[];
    public readonly perms: string[];

    constructor(client: Client, data: RawPrivateUser) {
        super(client, data);
        this.otp = data.otp;
        this.moneySpent = data.moneySpent;
        this.settings = data.settings;
        this.blocks = data.blocks;
        this.claimed = data.claimed;
        this.inventory = data.inventory;
        this.perms = data.perms;
    }

    // TODO: methods? not sure if privateuser has any specifc methods...
}

export default class UserManager {
    public initied: boolean = false;
    private readonly users: Map<number, User> = new Map();
    public readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async init(): Promise<PrivateUser> {
        if (this.initied) throw new Error("UserManager has already been initied");

        const { data } = await this.client.axiosInstace.get(endpoints.user.get());

        if (data.error) throw new Error(data.reason);

        const pUser = new PrivateUser(this.client, data.user);
        this.users.set(pUser.id, pUser);

        this.initied = true;
        this.client.user = pUser;
        return pUser;
    }

    public async getMe(force: boolean = false): Promise<PrivateUser> {
        if (!this.initied) throw new Error("UserManager has not been initied yet");

        if (force) {
            const { data } = await this.client.axiosInstace.get(endpoints.user.get());

            if (data.error) throw new Error(data.reason);

            const pUser = new PrivateUser(this.client, data.user);
            this.users.set(pUser.id, pUser);

            this.client.user = pUser;
            return pUser;
        }

        return this.client.user;
    }

    public getUserById(id: number): User | undefined {
        if (!this.initied) throw new Error("UserManager has not been initied yet");

        return this.users.get(id);
    }

    public getUserByName(name: string): User | undefined {
        if (!this.initied) throw new Error("UserManager has not been initied yet");

        return [...this.users.values()].find((user) => user.username === name);
    }

    public async fetchUser(idOrName: string | number): Promise<User> {
        if (!this.initied) throw new Error("UserManager has not been initied yet");

        if (idOrName === undefined) idOrName = this.client.user.id;
        const user = this.getUserByName(idOrName as string) || this.getUserById(idOrName as number);
        if (user) return user;

        const { data } = await this.client.axiosInstace.get(endpoints.user.get(idOrName));

        if (data.error && (data.reason === "User not found." || data.reason === "Username must be less than or 16 characters long.")) return null;
        else if (data.error) throw new Error(data.reason);

        const user_ = new User(this.client, data.user);
        await user_.init();
        this.users.set(user_.id, user_);

        return user_;
    }
}