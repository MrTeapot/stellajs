
export interface StellaRequest {
    getHeader(key: string): string | string[] | undefined;
    getCookie(key: string): string;
    getHostname(): string;
    getIp(): string;
    getProtocol(): string;
    getParams(): any;
    getQueryParams(): object;
    getBody(): any;
    isFailed(): boolean;
    setFailed(status: boolean): void;
    getPath(): string;
    setData(key: string, value: any): void;
    getData(key: string): any;
}