import axios from "axios"
import { randomBytes } from "node:crypto"
import { endpoints, version } from "./consts"
import * as parse from "set-cookie-parser";

/**
 * getToken - Get a session token from username and password via the API
 * @param username The username of the account
 * @param password The password of the accoutn
 * @param otp the OTP code, optional
 * @returns {String}
 */
const getToken = async (username: string, password: string, otp?: string): Promise<string> => {
    const { data, headers } = await axios.post(endpoints.base.concat(endpoints.auth.login), {
        username,
        password,
        code: otp
    }, {
        headers: {
            "User-Agent": `blacket.js (${version})`
        }
    });

    if (data?.error) throw new Error(data.reason);

    // @ts-ignore stupid package is weird
    const realParse = parse?.default || parse;
    return realParse(headers["set-cookie"]!, { map: true, decodeValues: false })["token"].value;
}

/**
 * getRandomText - Get a random string of text, used internally for IDs
 * @param {Number} size
 * @returns {Promise<String>}
 */
const getRandomText = async (size: number) => (await randomBytes(size)).toString("hex");

export { getToken, getRandomText };