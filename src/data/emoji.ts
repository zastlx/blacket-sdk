import { RawResource } from "../data.types";

export default class Emoji implements RawResource {
    public readonly name: string;
    public readonly image: string;

    constructor(data: RawResource, name: string) {
        this.name = name;
        this.image = data.image;
    }

    /**
     * getUrl - Get the full URL of the emoji image.
     * @returns {String}
     */
    public getUrl() {
        return `https://blacket.org${this.image}`;
    }
}