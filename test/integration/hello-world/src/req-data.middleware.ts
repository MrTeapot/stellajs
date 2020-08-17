import { StellaMiddleware } from "../../../../src/core/interfaces/Middleware";
import { NextFunction } from "express";
import { StellaRequest } from "../../../../src/core/interfaces/StellaRequest";
import { StellaResponse } from "../../../../src/core/interfaces/StellaResponse";
import { Service } from "../../../../src/core/decorators/Service";

export interface User {
  name: string;
}

@Service()
export class RequestData implements StellaMiddleware {

  async before(req: StellaRequest, res: StellaResponse, next: NextFunction) {
    req.setData('user', {
      name: 'Hello',
      hello: 'world'
    });
    await next();
  }
}
