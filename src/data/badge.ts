import { RawBadge } from "../data.types";

export default class Badge implements RawBadge {
    public readonly name: string;
    public readonly description: string;
    public readonly image: string;

    constructor(data: RawBadge, name: string) {
        this.name = name;
        this.description = data.description;
        this.image = data.image;
    }
    /**
     * getUrl - Get the full URL of the badge image.
     * @returns {String}
     */
    public getUrl() {
        return `https://blacket.org${this.image}`;
    }
}