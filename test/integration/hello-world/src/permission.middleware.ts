import { StellaMiddleware } from "../../../../src/interfaces/Middleware";
import { NextFunction } from "express";
import { StellaRequest } from "../../../../src/interfaces/StellaRequest";
import { StellaResponse } from "../../../../src/interfaces/StellaResponse";
import { Service } from "../../../../src/decorators/Service";
import { Forbidden } from "../../../../src/exceptions";

@Service()
export class PermissionMiddleware implements StellaMiddleware {
  async before(req: StellaRequest, res: StellaResponse, next: NextFunction) {
    const roles = req.getMetadata<string>("permission");
    if (req.getHeader("permission") === roles) {
      return
    }
    throw new Forbidden();
  }
}
