import { RawItem } from "./data.types";

const endpoints = {
    messages: {
        delete: (id: number) => `/worker/messages/${id}/delete`,
        edit: (id: number) => `/worker/messages/${id}/edit`
    },
    user: {
        get: (idOrName?: string | number) => `/worker2/user/${idOrName ?? ""}`
    },
    auth: {
        login: "/worker/login"
    },
    market: {
        open: "/worker3/open",
        sell: "/worker/sell"
    },
    items: {
        use: "/worker/use"
    },
    clans: {
        get: (id: number) => `/worker/clans/${id}`
    },
    data: "/data/index.json",
    base: "https://blacket.org"
};

const version = "0.0.0 dev";

const items: { [name: string]: RawItem } = {
    "1 Hour Booster": {
        "image": "/content/items/1 Hour Booster.webp",
        "description": "Boost <b>all</b> the chances of blooks by 1.5x to 2x <b>more</b> for <b>EVERYONE!</b> This booster lasts for <b>1 hour.</b>",
        "color": "linear-gradient(320deg, rgb(0, 129, 255) 0%, rgb(0, 133, 207) 25%, rgb(0, 224, 255) 100%)",
        "price": 100000
    },
    "3 Hour Booster": {
        "image": "/content/items/3 Hour Booster.webp",
        "description": "Boost <b>all</b> the chances of blooks by 2x <b>more</b> for <b>EVERYONE!</b> This booster lasts for <b>3 hours.</b>",
        "color": "linear-gradient(320deg, rgba(164,107,0,1) 0%, rgba(218,149,0,1) 25%, rgba(255,179,0,1) 100%)",
        "price": 250000
    },
    "24 Hour Booster": {
        "image": "/content/items/24 Hour Booster.webp",
        "description": "Boost <b>all</b> the chances of blooks by 2x <b>more</b> for <b>EVERYONE!</b> This booster lasts for <b>24 hours.</b>",
        "color": "linear-gradient(320deg, red, orange, yellow, lime, cyan, magenta)",
        "price": 1000000
    },
    "Stealth Disguise Kit (Item)": {
        "image": "/content/items/Stealth Disguise Kit.webp",
        "description": "Hide your clan name while attacking other clans!",
        "color": "linear-gradient(320deg, #72787D, #35393C)",
        "price": 250000
    },
    "Fragment Grenade (Item)": {
        "image": "/content/items/Fragment Grenade.webp",
        "description": "Throw one at a clan that isn't shielded to steal some of their investments!",
        "color": "linear-gradient(320deg, #437658, #254C34)",
        "price": 100000
    },
    "Clan Shield": {
        "image": "/content/items/Clan Shield.webp",
        "description": "Protects your investments from being stolen by Fragment Grenades! (If the clan is attacked, the shield will break)",
        "color": "linear-gradient(320deg, #70CFF1, #488EA8)",
        "price": 100000
    },
    "Red Paint Bucket": {
        "image": "/content/items/Red Paint Bucket.webp",
        "description": "Use this to change your clan color to red! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #FF0000, #B30000)",
        "price": 125000
    },
    "Orange Paint Bucket": {
        "image": "/content/items/Orange Paint Bucket.webp",
        "description": "Use this to change your clan color to orange! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #FF8000, #B35900)",
    },
    "Yellow Paint Bucket": {
        "image": "/content/items/Yellow Paint Bucket.webp",
        "description": "Use this to change your clan color to yellow! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #FFFF00, #B3B300)",
    },
    "Green Paint Bucket": {
        "image": "/content/items/Green Paint Bucket.webp",
        "description": "Use this to change your clan color to green! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #006400, #008C00)",
        "price": 115000
    },
    "Lime Paint Bucket": {
        "image": "/content/items/Lime Paint Bucket.webp",
        "description": "Use this to change your clan color to lime! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #80FF00, #59B300)"
    },
    "Cyan Paint Bucket": {
        "image": "/content/items/Cyan Paint Bucket.webp",
        "description": "Use this to change your clan color to cyan! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #00FFFF, #00B3B3)"
    },
    "Blue Paint Bucket": {
        "image": "/content/items/Blue Paint Bucket.webp",
        "description": "Use this to change your clan color to blue! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #0000FF, #0000B3)",
        "price": 120000
    },
    "Purple Paint Bucket": {
        "image": "/content/items/Purple Paint Bucket.webp",
        "description": "Use this to change your clan color to purple! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #8000FF, #5900B3)"
    },
    "Magenta Paint Bucket": {
        "image": "/content/items/Magenta Paint Bucket.webp",
        "description": "Use this to change your clan color to magenta! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #FF00FF, #B300B3)"
    },
    "Pink Paint Bucket": {
        "image": "/content/items/Pink Paint Bucket.webp",
        "description": "Use this to change your clan color to pink! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #D780D3, #B359B3)"
    },
    "Brown Paint Bucket": {
        "image": "/content/items/Brown Paint Bucket.webp",
        "description": "Use this to change your clan color to brown! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #804000, #593000)"
    },
    "Black Paint Bucket": {
        "image": "/content/items/Black Paint Bucket.webp",
        "description": "Use this to change your clan color to black! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, #0C0C0C, #1C1C1C)"
    },
    "Rainbow Paint Bucket": {
        "image": "/content/items/Rainbow Paint Bucket.webp",
        "description": "Use this to change your clan color to rainbow! You will not lose this item after using it.",
        "color": "linear-gradient(320deg, red, orange, yellow, lime, cyan, magenta, violet)"
    }
};

export { endpoints, version, items };