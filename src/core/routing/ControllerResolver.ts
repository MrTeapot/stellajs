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
} from "../Constants";
import { inject, injectable, container } from "tsyringe";
import { AbstractHTTPAdapter } from "../http/AbstractAdapter";

@injectable()
export class ControllerResolver {
  constructor(@inject("HTTPAdapter") private HTTPAdapter: AbstractHTTPAdapter) { }

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

    const { controllerBefore } = this.getMiddlewareFunctionsOnController(controllerMetadata);
    if (controllerBefore.length) {
      this.HTTPAdapter.applyMiddleware(controllerMetadata.url, controllerBefore);
    }

    endpoints.map((endpoint: EndpointMetadata) => {
      const { controllerAfter } = this.getMiddlewareFunctionsOnController(controllerMetadata)
      const { endpointBefore, endpointAfter } = this.getMiddlewareFunctionsOnEndpoint(endpoint);
      const handler = controllerInstance[endpoint.functionName].bind(
        controllerInstance
      );
      const before = [
        ...endpointBefore
      ];
      const after = [
        ...controllerAfter,
        ...endpointAfter
      ]
      const fullPath = this.getFullPath(controllerMetadata, endpoint);
      this.HTTPAdapter[endpoint.method](fullPath, { before, handler, after });
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
        return this.HTTPAdapter.middlewareFactory(
          middlewareInstance.before.bind(middlewareInstance)
        )
      }
      );

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
        return this.HTTPAdapter.middlewareFactory(
          middlewareInstance.after.bind(middlewareInstance)
        );
      });

    return {
      endpointBefore,
      endpointAfter,
    };
  }

  private getMiddlewareFunctionsOnController(controller: ControllerMetadata) {
    let controllerMiddleware = Reflect.getMetadata(MIDDLEWARE, controller.class) || [];
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
        return this.HTTPAdapter.middlewareFactory(
          middlewareInstance.before.bind(middlewareInstance)
        )
      }
      );

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
        return this.HTTPAdapter.middlewareFactory(
          middlewareInstance.after.bind(middlewareInstance)
        );
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
