import "reflect-metadata";

import { container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { StellaApplicationOptions } from "./interfaces";
import { ControllerResolver } from "./routing/ControllerResolver";
import { ExpressAdapter } from "./http/ExpressAdapter";
import { AbstractHTTPAdapter } from "./http/AbstractAdapter";

export class StellaApplication {
  private httpAdapter: AbstractHTTPAdapter;
  private controllers: constructor<any>[];
  private port: number;

  constructor({
    port,
    controllers,
    httpAdapter
  }: StellaApplicationOptions) {
    container.registerSingleton<AbstractHTTPAdapter>("HTTPAdapter", httpAdapter || ExpressAdapter);
    this.httpAdapter = container.resolve<AbstractHTTPAdapter>('HTTPAdapter');
    this.controllers = controllers;
    this.port = port;
  }

  async bootstrap() {
    // Resolve controllers and middleware from the container
    await this.httpAdapter.build();
    const controllerResolver = container.resolve(ControllerResolver);
    controllerResolver.resolve(this.controllers);
    await this.httpAdapter.start(this.port);
  }

  public getHTTPServer(): any {
    return this.httpAdapter.getHttpServer();
  }

  public shutdown() {
    this.httpAdapter.shutdown();
  }

}