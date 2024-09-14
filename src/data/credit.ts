import { Client, User } from "../index";
import { RawCredit } from "../data.types";
/*    nickname: string;
    image?: any;
    note: string;
    top?: boolean;
    user: RawConfigUser;*/
export default class Credit implements RawCredit {
    public readonly nickname: string;
    public readonly image?: string;
    public readonly note: string;
    public readonly top?: boolean;
    public user: User;
    public readonly client: Client;

    constructor(data: RawCredit, client: Client) {
        this.client = client;
        this.nickname = data.nickname;
        this.image = data.image;
        this.note = data.note;
        this.top = data.top;
        // lazy load the user
        this.client.userManager.fetchUser(data.user.id).then(user => this.user = user);
    }

    /**
     * getUrl - Get the full URL of the credit image.
     * @returns {String}
     */
    public getUrl() {
        return `https://blacket.org${this.image}`;
    }
}