import config from "config";
import fetch, { Headers, RequestInit } from "node-fetch";
import { getApiHubUrl } from "./getConfig";

export default async function d360APIFetch(
    path: string,
    options: RequestInit = { headers: new Headers() },

) {
    let baseUrl: string;
    const currentEnvironment = getApiHubUrl();
    baseUrl = config.get("env.eu_baseUrl");
    if (!currentEnvironment) {
        baseUrl = config.get("env.eu_baseUrl");
    }
    const url = `${baseUrl}${path}`;
    let headers = options.headers as Headers;
    if (!(options.headers instanceof Headers)) {
        headers = new Headers(options.headers);
    }
    return fetch(url, {
        ...options,
        headers
    }).then(res => {
        console.log(res);
        res.json().then(jsonBody => {
            console.log(jsonBody);
        })
    })

}