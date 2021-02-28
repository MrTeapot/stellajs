import { Server } from "http";
import { StellaResponse } from "../../interfaces/StellaResponse";
import cors from "fastify-cors";
import helmet from "helmet";
import { AbstractRequest } from "../AbstractRequest";

import {
  fastify,
  FastifyReply,
  FastifyRequest,
  FastifyInstance,
} from "fastify";

import { Request, Response } from "express";
import { AppError } from "../../exceptions";
import middie from "middie";
import { HTTPMethod } from "../../decorators/Endpoint";
import { AbstractHTTPAdapter, HandlerAndMiddleware } from "../AbstractAdapter";

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
    this.fastify.register(cors);
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

  private registerRoute(
    method: any,
    path: string,
    { handler, before, after }: HandlerAndMiddleware
  ) {
    this.fastify.route({
      url: this.normalizePath(path),
      method: method.toUpperCase(),
      handler,
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

  getRequestWrapper(req: FastifyRequest, res: FastifyReply) {
    return new FastifyRequestWrapper(req);
  }

  getResponseWrapper(req: FastifyRequest, res: FastifyReply) {
    return new FastifyResponseWrapper(res);
  }

  getNextFunction(req: Request, res: Response, next: Function) {
    return next;
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
      if (process.env.NODE_ENV === 'production') {
        res.send({
          sucess: false,
          errors: ['An unexpected error occured']
        });
      } else {
        res.send({
          succes: false,
          errors: [err]
        })
      }

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

  send(data: Object) {
    this.res.send(data);
  }

  setStatus(code: number) {
    this.res.status(code);
    return this;
  }

  redirect(url: string) {
    this.res.redirect(url);
  }

  setHeader(key: string, value: string) {
    this.res.header(key, value);
    return this;
  }
}
