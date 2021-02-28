import { constructor } from "tsyringe/dist/typings/types";
import { AbstractHTTPAdapter } from "../http/AbstractAdapter";
import { ExceptionHandler } from "./ExceptionHandler";

export interface StellaApplicationOptions {
  port: number;
  controllers: constructor<any>[];
  exceptionHandlers?: constructor<ExceptionHandler>[],
  httpAdapter?: constructor<AbstractHTTPAdapter>;
}
