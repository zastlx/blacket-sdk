import { Client, User } from "../index";
import { RawChatConfig, RawConfig, RawCredit, RawExp, RawPage, RawReports, RawStore } from "../data.types";

export class ConfigPage implements RawPage {
    public readonly icon: string;
    public readonly isChat: boolean;
    public readonly isNews: boolean;
    public readonly location: string;
    public readonly perm: string;

    constructor(data: RawPage) {
        this.icon = data.icon;
        this.isChat = data.isChat;
        this.isNews = data.isNews;
        this.location = data.location;
        this.perm = data.perm;
    }
}

export default class Config {
    public readonly name: string;
    public readonly version: string;
    public readonly welcome: string;
    public readonly description: string;
    public readonly pronunciation: string;
    public readonly discord: string;
    public readonly pages: { [name: string]: ConfigPage };
    public readonly chat: RawChatConfig;
    public readonly reports: RawReports;
    public readonly store: RawStore;
    public readonly exp: RawExp;
    public readonly rewards: number[];

    public readonly client: Client;

    constructor(data: RawConfig, client: Client) {
        this.client = client;
        this.name = data.name;
        this.version = data.version;
        this.welcome = data.welcome;
        this.description = data.description;
        this.pronunciation = data.pronunciation;
        this.discord = data.discord;
        this.pages = data.pages;
        this.chat = data.chat;
        this.reports = data.reports;
        this.store = data.store;
        this.exp = data.exp;
        this.rewards = data.rewards;
    }
    // TODO: methods? idk what would even go here lul
}