
export interface StellaResponse {
    setHeader(key: string, value: string): StellaResponse;
    setStatus(code: number): StellaResponse;
    send(json: Object): void;
    redirect(url: string): void;
}