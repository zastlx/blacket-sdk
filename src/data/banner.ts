import { RawResource } from "src/data.types";

export default class Banner implements RawResource {
    public readonly name: string;
    public readonly image: string;

    constructor(data: RawResource, name: string) {
        this.name = name;
        this.image = data.image;
    }
    /**
     * getUrl - Get the full URL of the banner image.
     * @returns {String}
     */
    public getUrl() {
        return `https://blacket.org${this.image}`;
    }
}