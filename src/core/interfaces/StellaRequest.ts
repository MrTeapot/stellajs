
export interface StellaRequest {
    getHeader(key: string): string | string[] | undefined;
    getCookie(key: string): string;
    getHostname(): string;
    getIp(): string;
    getProtocol(): string;
    getParams(): any;
    getQueryParams(): any;
    getBody(): any;
    isFailed(): boolean;
    setFailed(status: boolean): void;
    getPath(): string;
    setData(key: string, value: any): void;
    getData<T>(key: string): T;
    setHandler(handler: Function): void;
    getMetadata<T>(key: string): any;
}