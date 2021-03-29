
export interface StellaRequest {
    getHeader(key: string): string | string[] | undefined;
    getCookie(key: string): string;
    getHostname(): string;
    getIp(): string;
    getProtocol(): string;
    getParams(): any;
    getQueryParams(): any;
    getBody(): any;
    getFiles(): any;
    getRawBody(): Buffer;
    getPath(): string;
    setData(key: string, value: any): void;
    getData<T>(key: string): T;
    setHandler(handler: Function): void;
    setControllerConstructor(handler: Function): void;
    getMetadata<T>(key: string): T;
}