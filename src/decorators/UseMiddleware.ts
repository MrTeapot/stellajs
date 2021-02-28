import { MIDDLEWARE } from "../Constants";
import { constructor } from "tsyringe/dist/typings/types";
import { StellaMiddleware } from "../interfaces/Middleware";

/**
 * Specifies a given middleware to be used for controller or endpoint BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function UseMiddleware(
  ...args: constructor<StellaMiddleware>[]
): Function {
  return function (target: Object | Function, methodName: string) {
    Reflect.defineMetadata(MIDDLEWARE, args, target, methodName);
  };
}