import { constructor } from "tsyringe/dist/typings/types";

export interface ControllerMetadata {
  url: string;
  class: constructor<any>;
}
