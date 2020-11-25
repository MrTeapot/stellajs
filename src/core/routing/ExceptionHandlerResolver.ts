import { constructor } from "tsyringe/dist/typings/types";

import { injectable, container } from "tsyringe";
import { ExceptionHandler } from "../interfaces/ExceptionHandler";
import { EXCEPTION_HANDLER } from "../Constants";
import { StellaRequest } from "../interfaces";
import { StellaResponse } from "../interfaces/StellaResponse";
import { BaseExceptionHandler } from "../exceptions/DefaultExceptionHandler";

@injectable()
export class ExceptionHandlersResolver {
  constructor() { }

  resolve(exceptionHandlerClasses: constructor<ExceptionHandler>[]) {
    const exceptionHandlers = [...exceptionHandlerClasses, BaseExceptionHandler]
      .map((exceptionHandler) => container.resolve(exceptionHandler))
      .map(instance => {
        return {
          func: instance.catch.bind(instance),
          exceptionsToCatch: Reflect.getMetadata(EXCEPTION_HANDLER, instance.constructor) || []
        }
      });

    return async (request: StellaRequest, response: StellaResponse, exception: Error) => {

      // Explicit (@Catch(exception))
      let handler = exceptionHandlers.find(handler => !!handler.exceptionsToCatch.find((exceptionToHandle: any) => exception instanceof exceptionToHandle));

      if (!handler) {
        // Implicit (@Catch())
        handler = exceptionHandlers.find(handler => handler.exceptionsToCatch.length < 1);
      }

      if (handler) {
        await handler.func(request, response, exception);
      }

    }
  }

}