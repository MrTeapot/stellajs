import { EndpointMetadata } from "../interfaces";
import { inject, injectable } from "tsyringe";
import { AbstractHTTPAdapter } from "../http/AbstractAdapter";

interface HandlerFactoryParams {
  endpointMetadata: EndpointMetadata;
  endpointHandler: any;
  beforeHandlers: any[];
  afterHandlers: any[];
}

@injectable()
export class HandlerFactory {
  constructor(
    @inject("HTTPAdapter") private httpAdapter: AbstractHTTPAdapter
  ) {}

  createHandler({
    endpointMetadata,
    endpointHandler,
    beforeHandlers,
    afterHandlers,
  }: HandlerFactoryParams) {
    const that = this;
    return async function (...args: any) {
      let index = 0;

      const stack = [...beforeHandlers, endpointHandler, ...afterHandlers];

      const stellaRequest = that.httpAdapter.getRequestWrapper(...args);
      const stellaResponse = that.httpAdapter.getResponseWrapper(...args);

      try {
        await next();
      } catch (err) {
        if (args[2]) {
          args[2](err);
        } else {
          throw err;
        }
      }

      async function next(err?: any) {
        if (err) {
          throw err;
        }
        if (stack[index]) {
          await stack[index++](stellaRequest, stellaResponse, next);
        }
      }
    };
  }
}
