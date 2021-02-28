import "reflect-metadata";

import { EXCEPTION_HANDLER } from "../Constants";
import { Service } from "./Service";

export function Catch(...exceptions: any) {
  return function classDecorator<T extends { new(...args: any[]): {} }>(
    constructor: T
  ) {
    Reflect.defineMetadata(EXCEPTION_HANDLER, exceptions, constructor);

    // Make the handler an injectable service
    Service()(constructor);
  };
}


