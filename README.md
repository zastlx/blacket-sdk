# blacket-sdk
An API wrapper for https://blacket.org/ written in TypeScript, attempting providing 1:1 implementation of the API by v1.0.0
### Installation
```bash
npm install blacket-sdk
```

### Usage
```typescript
import { Client, getToken } from 'blacket-sdk';

const client = new Client({
    token: await getToken("zastix", "password"),
    // Whether to reconnect to the WebSocket when disconnected
    reconnect: true
});

client.on(SocketEvents.OPEN, (c) => {
    console.log(`Logged in as ${c.user.username} (${c.user.id})`);

    const room = c.roomManager.getOrCreateRoom(0, "global");

    await room.send("Hello, world!");
});
```

### Documentation
The documentation can be found [here](https://blacketjs.zastix.club/), we are actively working to improve our documentation!     


##### made with ❤️ by zastix
