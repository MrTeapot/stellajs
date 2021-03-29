import { constructor } from "tsyringe/dist/typings/types";
import {
  EndpointMetadata,
  StellaMiddleware,
  ControllerMetadata,
} from "../interfaces";
import {
  CONTROLLER_METADATA,
  MIDDLEWARE,
  ENDPOINT_METADATA,
  UPLOAD,
} from "../Constants";
import { inject, injectable, container } from "tsyringe";
import { AbstractHTTPAdapter } from "../http/AbstractAdapter";
import { HandlerFactory } from "./HandlerFactory";
import multer from "multer";

@injectable()
export class ControllerResolver {


  constructor(
    @inject("HTTPAdapter") private HTTPAdapter: AbstractHTTPAdapter,
    private handlerFactory: HandlerFactory
  ) { }

  resolve(controllers: constructor<any>[]) {
    const controllerInstances = controllers.map((controller) =>
      container.resolve(controller)
    );
    controllerInstances.map(this.registerEndpoints.bind(this));
  }

  private registerEndpoints(controllerInstance: any): void {
    const endpoints = Reflect.getOwnMetadata(
      ENDPOINT_METADATA,
      controllerInstance.constructor
    );
    const controllerMetadata: ControllerMetadata = Reflect.getMetadata(
      CONTROLLER_METADATA,
      controllerInstance.constructor
    );

    const { controllerBefore } = this.getMiddlewareFunctionsOnController(
      controllerMetadata
    );

    endpoints.map((endpoint: EndpointMetadata) => {
      const { controllerAfter } = this.getMiddlewareFunctionsOnController(
        controllerMetadata
      );
      const {
        endpointBefore,
        endpointAfter,
      } = this.getMiddlewareFunctionsOnEndpoint(endpoint);
      const handler = controllerInstance[endpoint.functionName].bind(
        controllerInstance
      );
      const before = [...controllerBefore, ...endpointBefore];
      const after = [...controllerAfter, ...endpointAfter];
      const fullPath = this.getFullPath(controllerMetadata, endpoint);

      const fullHandler = this.handlerFactory.createHandler({
        endpointMetadata: endpoint,
        endpointHandler: handler,
        beforeHandlers: before,
        afterHandlers: after,
      });

      const multerConfig = Reflect.getMetadata(UPLOAD, endpoint.target, endpoint.functionName);

      if (multerConfig) {
        const multerInstance = multer(multerConfig.options);
        this.HTTPAdapter.use(endpoint.path, multerInstance.single(multerConfig.fieldName));
      }

      this.HTTPAdapter[endpoint.method](fullPath, {
        before,
        handler: fullHandler,
        after,
      });
    });
  }

  private getMiddlewareFunctionsOnEndpoint(endpoint: EndpointMetadata) {
    let registeredMiddlewareOnEndpoint =
      Reflect.getMetadata(MIDDLEWARE, endpoint.target, endpoint.functionName) ||
      [];
    const endpointBefore = registeredMiddlewareOnEndpoint
      .map((middleware: constructor<StellaMiddleware>) =>
        container.resolve(middleware)
      )
      .filter((middlewareInstance: StellaMiddleware) =>
        isBeforeMiddleware(middlewareInstance)
      )
      .map((middlewareInstance: StellaMiddleware) => {
        if (!middlewareInstance.before) {
          return;
        }
        return middlewareInstance.before.bind(middlewareInstance)
      });

    const endpointAfter = registeredMiddlewareOnEndpoint
      .map((middleware: constructor<StellaMiddleware>) =>
        container.resolve(middleware)
      )
      .filter((middlewareInstance: StellaMiddleware) =>
        isAfterMiddleware(middlewareInstance)
      )
      .map((middlewareInstance: StellaMiddleware) => {
        if (!middlewareInstance.after) {
          return;
        }
        return middlewareInstance.after.bind(middlewareInstance);
      });

    return {
      endpointBefore,
      endpointAfter,
    };
  }

  private getMiddlewareFunctionsOnController(controller: ControllerMetadata) {
    let controllerMiddleware =
      Reflect.getMetadata(MIDDLEWARE, controller.class) || [];
    const controllerBefore = controllerMiddleware
      .map((middleware: constructor<StellaMiddleware>) =>
        container.resolve(middleware)
      )
      .filter((middlewareInstance: StellaMiddleware) =>
        isBeforeMiddleware(middlewareInstance)
      )
      .map((middlewareInstance: StellaMiddleware) => {
        if (!middlewareInstance.before) {
          return;
        }
        return middlewareInstance.before.bind(middlewareInstance);
      });

    const controllerAfter = controllerMiddleware
      .map((middleware: constructor<StellaMiddleware>) =>
        container.resolve(middleware)
      )
      .filter((middlewareInstance: StellaMiddleware) =>
        isAfterMiddleware(middlewareInstance)
      )
      .map((middlewareInstance: StellaMiddleware) => {
        if (!middlewareInstance.after) {
          return;
        }
        return middlewareInstance.after.bind(middlewareInstance);
      });

    return {
      controllerBefore,
      controllerAfter,
    };
  }

  private getFullPath(
    controllerMetadata: ControllerMetadata,
    endpoint: EndpointMetadata
  ): string {
    return controllerMetadata.url + endpoint.path;
  }
}

function isBeforeMiddleware(value: any): value is StellaMiddleware {
  return typeof value["before"] === "function";
}

function isAfterMiddleware(value: any) {
  return typeof value["after"] === "function";
}
