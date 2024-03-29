import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { AppError, NotFound } from "../../exceptions";
import { Server } from "http";
import { StellaResponse } from "../../interfaces/StellaResponse";
import helmet from 'helmet';
import { AbstractHTTPAdapter, HandlerAndMiddleware } from "../AbstractAdapter";
import { AbstractRequest } from "../AbstractRequest";
import bodyParser from 'body-parser';

export type Handler = (req: Request, res: Response, next: NextFunction) => void;

export class ExpressAdapter extends AbstractHTTPAdapter {

  private expressApp: express.Application;
  private httpServer: Server | undefined;

  constructor() {
    super();
    this.expressApp = express();
    this.expressApp.enable("trust proxy");
    this.expressApp.use(cors());
    this.expressApp.use(helmet());

    // Set rawBody
    this.expressApp.use(bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf
      }
    }))
  }

  async build() { }

  async start(port: number) {
    this.expressApp.use(this[404]);
    this.expressApp.use(this.defaultErrorHandler);
    this.httpServer = this.expressApp.listen(port);
  }

  shutdown() {
    if (!this.httpServer) {
      throw new Error('No HTTP server to shut down');
    }
    this.httpServer.close();
  }

  getHttpServer(): Server {
    if (!this.httpServer) {
      throw new Error('No HTTP server running');
    }
    return this.httpServer;
  }

  public applyMiddleware(path: string, before: Handler[]) {
    this.expressApp.use(path, before);
  }

  get(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.expressApp.get(path, handler)
  }

  put(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.expressApp.put(path, handler)
  }

  post(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.expressApp.post(path, handler)
  }

  patch(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.expressApp.patch(path, handler)
  }

  delete(path: string, { handler, before, after }: HandlerAndMiddleware) {
    this.expressApp.delete(path, handler)
  }

  use(path: string, middlewareFunction: any) {
    this.expressApp.use(path, middlewareFunction);
  }

  private defaultErrorHandler(
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
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

  private 404(req: Request, res: Response) {
    if (res.writableEnded) {
      return;
    }
    throw new NotFound();
  }

  getRequestWrapper(req: Request) {
    return new ExpressRequestWrapper(req);
  }

  getResponseWrapper(req: Request, res: Response) {
    return new ExpressResponseWrapper(res);
  }

  getNextFunction(req: Request, res: Response, next: Function) {
    return next;
  }

}

class ExpressRequestWrapper extends AbstractRequest {

  constructor(protected req: any) {
    super(req);
  }

  getProtocol() {
    return this.req.protocol;
  }

  getPath() {
    return this.req.originalUrl;
  }
}

class ExpressResponseWrapper implements StellaResponse {
  constructor(private res: Response) {
  }

  send(data: Object) {
    this.res.send(data);
  }

  setStatus(code: number): any {
    this.res.status(code);
    return this;
  }

  redirect(url: string) {
    this.res.redirect(url);
  }

  setHeader(key: string, value: string): any {
    this.res.setHeader(key, value);
    return this;
  }

}