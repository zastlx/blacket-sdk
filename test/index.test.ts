import "dotenv/config";
import { getToken, Client, SocketEvents, Message, User, PrivateUser, items, Room } from "../src";
import { test, expect, describe, it, beforeAll, afterAll } from "bun:test";
import Badge from "../src/data/badge";
import Emoji from "../src/data/emoji";
import Pack from "../src/data/pack";
import Banner from "../src/data/banner";
import Blook from "../src/data/blook";
import Item from "../src/data/item";
import WeeklyShopItem from "../src/data/weekly";
import Rarity from "../src/data/rarity";
import Config from "../src/data/config";
import Booster from "../src/data/booster";
import { Clan } from "../src/clan";

describe("env", () => {
    it("should have a USERNAME", () => {
        expect(process.env.USERNAME).toBeDefined();
    });
    it("should have a PASSWORD", () => {
        expect(process.env.PASSWORD).toBeDefined();
    });
});

test("getToken", async () => {
    const token = await getToken(process.env.USERNAME!, process.env.PASSWORD!);

    expect(token).toBeTypeOf("string");
    expect(token).toBeDefined();
}, {
    timeout: 1500,
    retry: 3
});

const waitTillOpen = (client: Client) => new Promise<Client>((resolve) => {
    client.socket.on(SocketEvents.OPEN, (c) => {
        resolve(c);
    });
});

describe("client", () => {
    let client: Client;

    beforeAll(async () => {
        client = new Client({
            token: await getToken(process.env.USERNAME!, process.env.PASSWORD!)
        });
        await waitTillOpen(client);
    });

    it("should have a token", () => {
        expect(client.token).toBeDefined();
    });

    it("should have a socket", () => {
        expect(client.socket).toBeDefined();
    });

    it("should have the managers", () => {
        expect(client.roomManager).toBeDefined();
        expect(client.userManager).toBeDefined();
        expect(client.dataManager).toBeDefined();
        expect(client.clanManager).toBeDefined();
    });

    it("should have the config", () => {
        expect(client.config).toBeDefined();
    });

    describe("roomManager", () => {
        it("should have a room", () => {
            expect(client.roomManager.getOrCreateRoom(0, "global")).toBeDefined();
        });

        it("should have a room", () => {
            expect(client.roomManager.getRoom(0)).toBeDefined();
        });

        describe("room", () => {
            let room: Room;
            let message: Message;

            beforeAll(() => {
                room = client.roomManager.getRoom(0)!;
            });

            afterAll(async () => {
                await message.delete();
            });

            it("should be defined", () => {
                expect(room).toBeDefined();
                expect(room.id).toBe(0);
                expect(room.name).toBe("global");
            });

            it("should send a message", async () => {
                message = await room.send("[blacket.js - <hotpink>bun test</hotpink>] test");
                expect(message).toBeDefined();
                expect(message).toBeInstanceOf(Message);
            });
        });
    });

    describe("userManager", () => {
        it("should have a user", async () => {
            const user = await client.userManager.fetchUser(client.user.id);
            expect(user).toBeDefined();
            expect(user).toBeInstanceOf(User);
            expect(user.username).toBe(client.user.username);
            expect(user.id).toBe(client.user.id);
        });

        it("should fetch another user", async () => {
            const user = await client.userManager.fetchUser(0);
            expect(user).toBeDefined();
            expect(user).toBeInstanceOf(User);
            expect(user.username).toBe("Blacket");
            expect(user.id).toBe(0);
        });
    });

    describe("dataManager", () => {
        it("badges", async () => {
            const badges = await client.dataManager.getBadges();
            expect(badges).toBeDefined();
            expect(badges).toBeArray();
            expect(badges[0]).toBeInstanceOf(Badge);

            const badge = await client.dataManager.getBadge("kangooro")!;
            expect(badge).toBeDefined();
            expect(badge).toBeInstanceOf(Badge);
            expect(badge.getUrl()).toBe("https://blacket.org/content/badges/syfe.png");
        });

        it("emojis", async () => {
            const emojis = await client.dataManager.getEmojis();
            expect(emojis).toBeDefined();
            expect(emojis).toBeArray();
            expect(emojis[0]).toBeInstanceOf(Emoji);

            const emoji = await client.dataManager.getEmoji("hehe")!;
            expect(emoji).toBeDefined();
            expect(emoji).toBeInstanceOf(Emoji);
            expect(emoji.getUrl()).toBe("https://blacket.org/content/emojis/hehe.webp")
        });

        it("packs", async () => {
            const packs = await client.dataManager.getPacks();
            expect(packs).toBeDefined();
            expect(packs).toBeArray();
            expect(packs[0]).toBeInstanceOf(Pack);

            const pack = await client.dataManager.getPack("OG")!;
            const zastix = await client.dataManager.getBlook("zastix");
            expect(pack).toBeDefined();
            expect(pack).toBeInstanceOf(Pack);
            const blooks = await pack.getBlooks();
            expect(blooks).toBeArray();
            expect(blooks).toContain(zastix);
        });

        it("banners", async () => {
            const banners = await client.dataManager.getBanners();
            expect(banners).toBeDefined();
            expect(banners).toBeArray();
            expect(banners[0]).toBeInstanceOf(Banner);

            const banner = await client.dataManager.getBanner("Comic");
            expect(banner).toBeDefined();
            expect(banner).toBeInstanceOf(Banner);
        });

        it("blooks", async () => {
            const blooks = await client.dataManager.getBlooks();
            expect(blooks).toBeDefined();
            expect(blooks).toBeArray();
            expect(blooks[0]).toBeInstanceOf(Blook);

            const blook = await client.dataManager.getBlook("zastix")!;
            expect(blook).toBeDefined();
            expect(blook).toBeInstanceOf(Blook);
            expect(blook.name).toBe("zastix");
            expect(blook.getBlookEmoji()).toEqual("[zastix]");
            expect(blook.pack).toBeInstanceOf(Pack);
            expect(blook.isDay()).toBeTrue();
            expect(blook.canListAt(1)).toBeTrue();
            expect(blook.canListAt(10000000)).toBeTrue();
        });

        it("items", async () => {
            const items = await client.dataManager.getItems();
            expect(items).toBeDefined();
            expect(items).toBeArray();
            expect(items[0]).toBeInstanceOf(Item);

            const item = await client.dataManager.getItem("1 Hour Booster");
            expect(item).toBeDefined();
            expect(item).toBeInstanceOf(Item);
        });

        it("weeklyShops", async () => {
            const weeklyShop = await client.dataManager.getWeeklyShop();
            expect(weeklyShop).toBeDefined();
            expect(weeklyShop).toBeArray();
            expect(weeklyShop[0]).toBeInstanceOf(WeeklyShopItem);

            const weeklyShopItem = await client.dataManager.getWeeklyShopItem("Purple Paint Bucket");

            expect(weeklyShopItem).toBeDefined();
            expect(weeklyShopItem).toBeInstanceOf(WeeklyShopItem);
        });

        it("raritys", async () => {
            const rarity = await client.dataManager.getRarities();
            expect(rarity).toBeDefined();
            expect(rarity).toBeArray();
            expect(rarity[0]).toBeInstanceOf(Rarity);

            const rarityByName = await client.dataManager.getRarity("Uncommon");
            expect(rarityByName).toBeDefined();
            expect(rarityByName).toBeInstanceOf(Rarity);
        });

        it("config", async () => {
            const config = await client.dataManager.getConfig();
            expect(config).toBeDefined();
            expect(config).toBeInstanceOf(Config);
        });

        it("booster", async () => {
            const booster = await client.dataManager.getBooster();
            expect(booster).toBeDefined();
            expect(booster).toBeInstanceOf(Booster);
        });
    });

    describe("clanManager", () => {
        it("should have a clan", async () => {
            const clan = await client.clanManager.fetchClan(8424028, true);
            expect(clan).toBeDefined();
            expect(clan).toBeInstanceOf(Clan);
            expect(clan.name).toBe("Piggie");
            expect(clan.id).toBe(8424028);
        });
    });

    describe("socket", () => {
        it("should handle socket events", async () => {
            client.socket.on(SocketEvents.MESSAGE_CREATE, (message) => {
                if (message.author.id !== client.user.id) return;

                expect(message).toBeDefined();
                expect(message).toBeInstanceOf(Message);
                expect(message.content).toBe("[blacket.js - <hotpink>bun test</hotpink>] test2");

                expect(message.author).toBeInstanceOf(User);
                expect(message.author.id).toBe(client.user.id);

                expect(message.room).toBeDefined();
                expect(message.room.id).toBe(0);
            });

            client.socket.on(SocketEvents.MESSAGE_EDIT, (data) => {
                expect(data.message).toBeDefined();
                const message = data.message!;
                if (message.author.id !== client.user.id) return;

                expect(message).toBeDefined();
                expect(message).toBeInstanceOf(Message);
                expect(message.content).toBe("[blacket.js - <hotpink>bun test</hotpink>] test2: edited");

                expect(message.author).toBeInstanceOf(User);
                expect(message.author.id).toBe(client.user.id);

                expect(message.room).toBeDefined();
                expect(message.room.id).toBe(0);
            });

            client.socket.on(SocketEvents.MESSAGE_DELETE, (data) => {
                expect(data.message).toBeDefined();
                const message = data.message!;
                if (message.author.id !== client.user.id) return;

                expect(message).toBeDefined();
                expect(message).toBeInstanceOf(Message);

                expect(message.author).toBeInstanceOf(User);
                expect(message.author.id).toBe(client.user.id);

                expect(message.room).toBeDefined();
                expect(message.room.id).toBe(0);
            });

            const msg = await client.roomManager.getOrCreateRoom(0, "global").send("[blacket.js - <hotpink>bun test</hotpink>] test2");
            await msg.edit("[blacket.js - <hotpink>bun test</hotpink>] test2: edited");
            await msg.delete();
        });
    });
});