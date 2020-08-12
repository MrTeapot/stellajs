import express from "express";

export interface PermissionMiddlewareFactory {
  getMiddlewareFunction(
    permission: string
  ): (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void>;
}
