import "dotenv/config";
import { getToken, Client, SocketEvents } from "../src";
import { sleep } from "bun";
import { writeFile } from "fs/promises";
import { BazaarListing } from "../src/bazaar";

const c = new Client({
    token: await getToken(process.env.USERNAME!, process.env.PASSWORD!),
    reconnect: true
});

c.on(SocketEvents.OPEN, async (u) => {
    console.log(`Logged in as ${u.user.username} (${u.user.id})`);

    const user = await c.userManager.fetchUser("zastix");
    console.log(`Fetching user ${user.username} (${user.id})`);

    const ac = (await c.dataManager.getBlook("acai"))!;
    const b = await ac.list(100);
    console.log(await (b as BazaarListing).remove());
});

await c.login();