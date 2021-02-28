import { EndpointMetadata } from "../interfaces";
import { container, inject, injectable } from "tsyringe";
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
  ) { }

  public createHandler({
    endpointMetadata,
    endpointHandler,
    beforeHandlers,
    afterHandlers,
  }: HandlerFactoryParams) {
    const that = this;
    return async function (...args: any) {

      const stack = [...beforeHandlers, endpointHandler, ...afterHandlers];

      const stellaRequest = that.httpAdapter.getRequestWrapper(...args);
      stellaRequest.setHandler(endpointMetadata.originalHandler);
      stellaRequest.setControllerConstructor(endpointMetadata.controller);
      const stellaResponse = that.httpAdapter.getResponseWrapper(...args);

      const exceptionHandler: Function = container.resolve('EXCEPTION_HANDLER');

      try {
        for (let i = 0; i < stack.length; i++) {
          await stack[i](stellaRequest, stellaResponse);
        }
      } catch (err) {
        await exceptionHandler(stellaRequest, stellaResponse, err);
      }

    };
  }
}
