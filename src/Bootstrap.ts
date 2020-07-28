import "reflect-metadata"

import express from "express";
import { container } from "tsyringe";
import bodyParser from "body-parser";
import cors from "cors";
import { CONTROLLER_METADATA, ENDPOINT_METADATA, MIDDLEWARE_BEFORE } from "./Constants";
import { Middleware } from "./Middleware";
import { constructor } from "tsyringe/dist/typings/types";
import { ControllerMetadata } from "./decorators/Controller";
import { EndpointMetadata } from "./decorators/Endpoint";
import { PermissionMiddlewareFactory } from "./PermissionMiddlewareFactory";

interface StellaApplicationOptions {
  port: number;
  controllers: constructor<any>[];
  errorHandler(req: express.Request, res: express.Response, next: express.NextFunction): void;
  permissionMiddlewareFactory: constructor<PermissionMiddlewareFactory>
}

export class StellaApplication {

  private expressApp: express.Application;
  private controllers: constructor<any>[];
  private permissionMiddlewareFactory: PermissionMiddlewareFactory;
  private errorHandler: StellaApplicationOptions["errorHandler"];

  constructor({
    port,
    controllers,
    errorHandler,
    permissionMiddlewareFactory
  }: StellaApplicationOptions) {
    this.expressApp = express();
    this.errorHandler = errorHandler;

    this.controllers = controllers;
    this.permissionMiddlewareFactory = container.resolve(permissionMiddlewareFactory);

    this.loadMiddleware();
    this.bootstrap();
    this.expressApp.use(this.errorHandler);
    this.expressApp.listen(port);
  };

  private loadMiddleware() {
    this.expressApp.enable("trust proxy");
    this.expressApp.use(cors());
    this.expressApp.use(bodyParser.json());
  }

  private bootstrap() {

    // Resolve controllers and middleware from the container

    this.controllers.forEach((controller: constructor<any>) => {

      const controllerInstance = container.resolve(controller);
      const controllerMetadata: ControllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA, controller);

      // Array of all middleware classes used by this controller
      const controllerMiddleware: constructor<Middleware>[] = Reflect.getMetadata(MIDDLEWARE_BEFORE, controller) || [];

      console.log('\n', '------------------------------------------------------------');
      console.group('\x1b[32m', 'Controller:', '\x1b[32m', controllerMetadata.url);
      console.log('Middleware:', controllerMiddleware);
      console.group('Endpoints:');

      const expressRouter = express.Router();

      //Apply middleware for whole controller
      controllerMiddleware.forEach(middleware => {
        const instance: any = container.resolve(middleware);
        expressRouter.use(instance.use.bind(instance));
      });

      // Get registered endpoints for this controller
      const endpoints: EndpointMetadata[] = Reflect.getOwnMetadata(ENDPOINT_METADATA, controller) || [];

      // Loop through the endpoints and register them on the controller
      endpoints.forEach(endpoint => {
        console.group('\x1b[36m' + endpoint.method + ": " + endpoint.url);

        const registeredMiddlewareOnEndpoint = Reflect.getMetadata(MIDDLEWARE_BEFORE, endpoint.target, endpoint.functionName) || [];

        if (registeredMiddlewareOnEndpoint.length) {
          console.log('Middleware:', registeredMiddlewareOnEndpoint);
        }

        const middlewareFunctions = registeredMiddlewareOnEndpoint.map((middleware: constructor<Middleware>) => {
          const instance: any = container.resolve(middleware);
          return instance.use.bind(instance);
        })

        if (endpoint.permission) {
          console.log('Permissions:', endpoint.permission)
          middlewareFunctions.push(this.permissionMiddlewareFactory.getMiddlewareFunction(endpoint.permission));
        }

        expressRouter[endpoint.method](
          endpoint.url,
          ...middlewareFunctions,
          controllerInstance[endpoint.functionName].bind(controllerInstance)
        );
        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();

      this.expressApp.use(controllerMetadata.url, expressRouter);
    });

  }
}