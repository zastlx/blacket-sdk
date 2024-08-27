export interface RawData {
    config: RawConfig;
    booster: RawBooster;
    credits: RawCredit[];
    news: RawNews[];
    // this is never used im not gonna bother
    presets: any;
    blooks: RawBlooks;
    rarities: RawRarities;
    packs: RawPacks;
    banners: RawBanners;
    badges: RawBadges;
    emojis: RawEmojis;
    weekly_shop: RawWeeklyShop;
}

export interface RawWeeklyShop {
    [name: string]: RawWeeklyShopItem;
}

export interface Items {
    [name: string]: RawItem;
}

export interface RawItem {
    description: string;
    image: string;
    price?: number;
    color: string;
}

export interface RawWeeklyShopItem {
    price: number;
    glow: boolean;
}

export interface RawEmojis {
    [name: string]: RawResource;
}

export interface RawBadges {
    [name: string]: RawBadge;
}

export interface RawBadge {
    image: string;
    description: string;
}

export interface RawBanners {
    [name: string]: RawResource;
}

export interface RawResource {
    image: string;
}

export interface RawPacks {
    [name: string]: RawPack;
}

export interface RawPack {
    price: number;
    color1: string;
    color2: string;
    image: string;
    blooks: string[];
    hidden: boolean;
}

export interface RawRarities {
    Common: RawRarity;
    Uncommon: RawRarity;
    Rare: RawRarity;
    Epic: RawRarity;
    Legendary: RawRarity;
    Chroma: RawRarity;
    Unique: RawRarity;
    Mystical: RawRarity;
    Iridescent: RawRarity;
    ULTRA: RawRarity;
}

export interface RawRarity {
    color: string;
    animation: string;
    exp: number;
    wait: number;
}

export interface RawBlooks {
    [name: string]: RawBlook;
}

export interface RawBlook {
    rarity: string;
    chance: number;
    price: number;
    image: string;
    art: string;
    onlyOnDay?: number | null;
    bazaarMinimumListingPrice?: number | null;
    bazaarMaximumListingPrice?: number | null;
}

export interface RawCommon {
    color: string;
    perms: any[];
    badges: any[];
}

export interface RawNews {
    title: string;
    image: string;
    body: string;
    date: number;
}

export interface RawCredit {
    nickname: string;
    image?: any;
    note: string;
    top?: boolean;
    user: RawConfigUser;
}

export interface RawConfigUser {
    id: number;
    username: string;
    avatar: string;
    banner: string;
    badges: string[];
    role: string;
    color: string;
}

export interface RawBooster {
    active: boolean;
    time: number;
    multiplier: number;
    user?: any;
}

export interface RawConfig {
    name: string;
    version: string;
    welcome: string;
    description: string;
    pronunciation: string;
    discord: string;
    store: RawStore;
    rewards: number[];
    exp: RawExp;
    pages: RawPagesConfig;
    chat: RawChatConfig;
    reports: RawReports;
    credits: RawConfigCredit[];
}

export interface RawConfigCredit {
    user: number;
    nickname: string;
    image?: any;
    top?: boolean;
    note: string;
}

export interface RawReports {
    user: RawUserReportReason;
    message: RawMessageReportReason;
}

export interface RawMessageReportReason {
    [reportCategory: string]: string[];
}

export interface RawUserReportReason {
    [reportCategory: string]: string[];
}

export interface RawChatConfig {
    tokens: number;
    exp: number;
    cooldown: number;
}

export interface RawPagesConfig {
    [name: string]: RawPage;
}

export interface RawPage {
    link?: any;
    icon: string;
    isNews: boolean;
    isChat: boolean;
    location: string;
    perm: string;
}

export interface RawExp {
    difficulty: number;
}

export interface RawStore {
    [name: string]: RawStoreItem;
}

export interface RawStoreItem {
    price: string;
    sale: RawSale;
}

export interface RawSale {
    price: string;
    name?: any;
}