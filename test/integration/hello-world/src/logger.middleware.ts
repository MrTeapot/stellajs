import { StellaMiddleware } from "../../../../src/core/interfaces/Middleware";
import { NextFunction } from "express";
import { StellaRequest } from "../../../../src/core/interfaces/StellaRequest";
import { StellaResponse } from "../../../../src/core/interfaces/StellaResponse";

export class LoggerMiddleware implements StellaMiddleware {

  async before(req: StellaRequest, res: StellaResponse, next: NextFunction) {
    next();
  }

  async after(req: StellaRequest, res: StellaResponse, next: NextFunction) {
    next();
  }
}
