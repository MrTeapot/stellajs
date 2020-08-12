import { constructor } from "tsyringe/dist/typings/types";
import { AbstractHTTPAdapter } from "../http/AbstractAdapter";

export interface StellaApplicationOptions {
  port: number;
  controllers: constructor<any>[];
  httpAdapter?: constructor<AbstractHTTPAdapter>;
}
