import { constructor } from "tsyringe/dist/typings/types";
import { EndpointOptions } from "./EndpointOptions";

export interface EndpointMetadata extends EndpointOptions {
    controller: constructor<any>;
    target: Function;
    path: string;
    functionName: string;
  }