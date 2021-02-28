import { ControllerMetadata } from "./ControllerMetadata";
import { constructor } from "tsyringe/dist/typings/types";
import { StellaMiddleware } from "./Middleware";
import { EndpointMetadataWithMiddleware } from "./EndpointMetadataWithMiddleware";

export interface ApplicationControllerMetadata {
    controller: ControllerMetadata;
    endpoints: EndpointMetadataWithMiddleware;
    middleware: constructor<StellaMiddleware>[]
}