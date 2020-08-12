import { HTTPMethod } from "../decorators/Endpoint";

export interface EndpointOptions {
  method: HTTPMethod;
  path?: string;
  schema?: object;
  httpStatusCode?: number;
}