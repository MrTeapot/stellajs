import { PermissionMiddlewareFactory } from "../../../../src/core/interfaces/PermissionMiddlewareFactory";
import { Request, Response, NextFunction } from "express";

export class PermissionFactory implements PermissionMiddlewareFactory {
  getMiddlewareFunction(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      next();
    };
  }
}
