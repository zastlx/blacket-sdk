import "dotenv/config";
import { getToken, Client, SocketEvents } from "../src";

const c = new Client({
    token: await getToken(process.env.USERNAME!, process.env.PASSWORD!),
    reconnect: true
});

c.on(SocketEvents.OPEN, async (u) => {
    console.log(`Logged in as ${u.user.username} (${u.user.id})`);

    const room = c.roomManager.getOrCreateRoom(0, "global");
    // const msg = await room.sendMessage("Hello, world!");

    const user = await c.userManager.fetchUser("zastix");
    // console.log(user.clan);
    // msg.reply("ping2");
});