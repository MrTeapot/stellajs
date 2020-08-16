import { StellaRequest } from "../interfaces";

export abstract class AbstractRequest implements StellaRequest {

    private requestData: any = {};
    private hasFailed: boolean = false;

    constructor(protected req: any) { }

    setData(key: string, value: any): void {
        this.requestData[key] = value;
    }

    getData<T>(key: string): T {
        return this.requestData[key];
    }

    isFailed() {
        return this.hasFailed;
    }

    setFailed(status: boolean) {
        this.hasFailed = status;
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