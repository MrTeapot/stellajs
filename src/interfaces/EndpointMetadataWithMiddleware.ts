import { EndpointMetadata } from "./EndpointMetadata";
import { StellaMiddleware } from "./Middleware";

export interface EndpointMetadataWithMiddleware extends EndpointMetadata {
  middleware: StellaMiddleware
}