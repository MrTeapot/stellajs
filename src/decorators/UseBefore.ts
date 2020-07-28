import { MIDDLEWARE_BEFORE } from "framework/Constants";

/**
 * Specifies a given middleware to be used for controller or endpoint BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function UseBefore(...middlewares: Array<Function | ((request: any, response: any, next: Function) => any)>): Function {
    return function (target: Object | Function, methodName?: string) {
        const middleware = middlewares.map(middleware => {
            return {
                middleware: middleware
            }
        });
        Reflect.defineMetadata(MIDDLEWARE_BEFORE, middleware, target, methodName);
    };
}