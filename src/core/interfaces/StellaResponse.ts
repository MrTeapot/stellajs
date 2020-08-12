
export interface StellaResponse {
    setHeader(key: string, value: string): void;
    setStatus(code: number): void;
    send(json: string): void;
    redirect(url: string): void;
}