import { StellaRequest } from "../interfaces";

export abstract class AbstractRequest implements StellaRequest {

  private requestData: any = {};
  private handler: any;
  private controllerConstructor: any;

  constructor(protected req: any) { }

  setData(key: string, value: any): void {
    this.requestData[key] = value;
  }

  getData<T>(key: string): T {
    return this.requestData[key];
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

  // If the @Upload decorator was used, this method will return the uploaded files object
  getFiles() {
    return this.req.files || this.req.file;
  }

  getRawBody() {
    return this.req.rawBody;
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

  getMetadata<T>(key: string): T {
    return Reflect.getMetadata(key, this.handler) || Reflect.getMetadata(key, this.controllerConstructor)
  }

  setHandler(handler: Function) {
    this.handler = handler;
  }

  setControllerConstructor(constructor: Function) {
    this.controllerConstructor = constructor;
  }
}