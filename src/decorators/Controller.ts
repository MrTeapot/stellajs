import "reflect-metadata";

import { CONTROLLER_METADATA } from "../Constants";
import { Service } from "./Service";

export function Controller(url: string) {
  return function classDecorator<T extends { new(...args: any[]): {} }>(
    constructor: T
  ) {
    Reflect.defineMetadata(
      CONTROLLER_METADATA,
      {
        url,
        class: constructor,
      },
      constructor
    );

    // Make the controller an injectable service
    Service()(constructor);
  };
}


