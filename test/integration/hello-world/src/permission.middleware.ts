import { StellaMiddleware } from "../../../../src/core/interfaces/Middleware";
import { NextFunction } from "express";
import { StellaRequest } from "../../../../src/core/interfaces/StellaRequest";
import { StellaResponse } from "../../../../src/core/interfaces/StellaResponse";
import { Service } from "../../../../src/core/decorators/Service";
import { Forbidden } from "../../../../src/core/exceptions";

@Service()
export class PermissionMiddleware implements StellaMiddleware {
  async before(req: StellaRequest, res: StellaResponse, next: NextFunction) {
    const roles = req.getMetadata<string>("permission");
    if (req.getHeader("permission") === "king") {
      return await next();
    }
    throw new Forbidden();
  }
}
