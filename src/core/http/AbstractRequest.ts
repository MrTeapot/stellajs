import { StellaRequest } from "../interfaces";

export abstract class AbstractRequest implements StellaRequest {

    constructor(protected req: any) { }

    setData(key: string, value: any): void {
        this.req['__' + key] = value;
    }

    getData<T>(key: string): T {
        return this.req['__' + key];
    }

    isFailed() {
        return this.req.__isFailed;
    }

    setFailed(status: boolean) {
        this.req.__isFailed = status;
    }

    getParams() {
        return this.req.params;
    }

    getQueryParams() {
        return this.req.query;
    }

    getProtocol() {
        return this.req.protocol;
    }

    getHeader(key: string) {
        return this.req.headers[key];
    }

    getBody() {
        return this.req.body;
    }

    getCookie(key: string) {
        return this.req.cookies[key];
    }

    getHostname() {
        return this.req.hostname;
    }

    getIp() {
        return this.req.ip
    }

    getPath() {
        return this.req.originalUrl;
    }
}