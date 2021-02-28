import { constructor } from "tsyringe/dist/typings/types";
import { EndpointOptions } from "./EndpointOptions";
import { EndpointMetadata } from "./EndpointMetadata";
import { StellaMiddleware } from "./Middleware";

export interface EndpointMetadataWithMiddleware extends EndpointMetadata {
  middleware: StellaMiddleware
}