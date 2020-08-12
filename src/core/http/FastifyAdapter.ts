import { Server } from "http";
import { StellaResponse } from "../interfaces/StellaResponse";
import cors from "cors";
import helmet from "helmet";
import { AbstractRequest } from './AbstractRequest';

import {
  fastify,
  FastifyReply,
  FastifyRequest,
  FastifyInstance,
} from "fastify";

import { Request, Response } from "express";
import { AppError } from "../exceptions";
import middie from "middie";
import { HTTPMethod } from "../decorators/Endpoint";
import { AbstractHTTPAdapter, HandlerAndMiddleware } from "./AbstractAdapter";

export class FastifyAdapter extends AbstractHTTPAdapter {
  private fastify: FastifyInstance;

  constructor() {
    super();
    this.fastify = fastify();
  }

  async build() {
    await this.fastify.register(middie);
  }

  async start(port: number) {
    this.fastify.setErrorHandler(this.defaultErrorHandler);
    this.fastify.use(cors());
    this.fastify.use(helmet());
    await this.fastify.listen(port);
  }

  shutdown() {
    this.fastify.server.close();
  }

  getHttpServer(): Server {
    return this.fastify.server;
  }

  private normalizePath(path: string): string {
    return path === "/*" ? "" : path;
  }

  public applyMiddleware(path: string, before: Function[], method: HTTPMethod) {
    //console.log('registering', path, method);
    this.fastify.use(
      path,
      before.map((before) => this.checkMethod(method, before))
    );
  }

  private registerRoute(method: HTTPMethod, path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.fastify.register((fastify, opts, done) => {
      after = after.map((after) => this.afterWrapper(after));
      fastify[method](this.normalizePath(path), {
        handler: handler,
        onResponse: after,
      });

      fastify.use(
        path,
        before
      );

      done();
    });
  }

  get(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.registerRoute(HTTPMethod.GET, path, { handler, before, after });
  }

  put(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.registerRoute(HTTPMethod.PUT, path, { handler, before, after });
  }

  post(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.registerRoute(HTTPMethod.POST, path, { handler, before, after });
  }

  patch(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.registerRoute(HTTPMethod.PATCH, path, { handler, before, after });
  }

  delete(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.registerRoute(HTTPMethod.DELETE, path, { handler, before, after });
  }

  middlewareFactory(middleWareFunction: Function) {
    const that = this;
    return function (req: FastifyRequest, res: FastifyReply, next: Function) {
      const stellaRequest = that.getRequestWrapper(req, res);
      const stellaResponse = that.getResponseWrapper(req, res);
      return middleWareFunction(stellaRequest, stellaResponse, next);
    };
  }

  getRequestWrapper(req: FastifyRequest, res: FastifyReply) {
    return new FastifyRequestWrapper(req);
  }

  getResponseWrapper(req: FastifyRequest, res: FastifyReply) {
    return new FastifyResponseWrapper(res);
  }

  getNextFunction(req: Request, res: Response, next: Function) {
    return next;
  }

  private checkMethod(method: HTTPMethod, cb: Function) {
    return function (req: FastifyRequest, res: FastifyReply, next: Function) {
      if (!method || req.method === method.toUpperCase()) {
        return cb(req, res, next);
      } else {
        next();
      }
    };
  }

  private afterWrapper(cb: Function) {
    const that = this;
    return function (req: FastifyRequest, res: FastifyReply, next: Function) {
      const stellaRequest = that.getRequestWrapper(req, res);
      if (!stellaRequest.isFailed()) {
        return cb(req, res, next);
      } else {
        next();
      }
    };
  }

  private defaultErrorHandler(
    err: Error,
    req: FastifyRequest,
    res: FastifyReply
  ) {
    if (err instanceof AppError) {
      res.status(err.statusCode);
      res.send({
        success: false,
        errors: err.errors,
      });
    } else {
      res.status(500);
    }
  }
}

class FastifyRequestWrapper extends AbstractRequest {

  constructor(protected req: any) {
    super(req);
  }

  getProtocol() {
    throw new Error("Not implemented in Fastify");
    return "";
  }

  getPath() {
    return this.req.originalUrl || this.req.url;
  }
}

class FastifyResponseWrapper implements StellaResponse {
  constructor(private res: FastifyReply) { }

  send(json: string) {
    this.res.send(json);
  }

  setStatus(code: number) {
    this.res.status(code);
  }

  redirect(url: string) {
    this.res.redirect(url);
  }

  setHeader(key: string, value: string) {
    this.res.header(key, value);
  }
}
