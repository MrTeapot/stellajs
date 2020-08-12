import { Server } from "http";
import { StellaRequest } from "../interfaces/StellaRequest";
import { StellaResponse } from "../interfaces/StellaResponse";
import { HTTPMethod } from "../decorators/Endpoint";

export interface HandlerAndMiddleware {
  handler: any;
  before: any[];
  after: any[];
}

export abstract class AbstractHTTPAdapter {
  abstract start(port: number): Promise<void>;
  abstract getHttpServer(): Server;
  abstract build(): Promise<void>;
  abstract shutdown(): any;
  abstract get(path: string, handlerAndMiddleware: HandlerAndMiddleware): void;
  abstract put(path: string, handlerAndMiddleware: HandlerAndMiddleware): void;
  abstract patch(path: string, handlerAndMiddleware: HandlerAndMiddleware): void;
  abstract post(path: string, handlerAndMiddleware: HandlerAndMiddleware): void;
  abstract delete(path: string, handlerAndMiddleware: HandlerAndMiddleware): void;
  abstract getRequestWrapper(...args: any): StellaRequest;
  abstract getResponseWrapper(...args: any): StellaResponse;
  abstract getNextFunction(...args: any): Function;
  abstract middlewareFactory(middleWareFunction: Function): Function;
  abstract applyMiddleware(path: string, before: Function[], method?: HTTPMethod): void;
}
