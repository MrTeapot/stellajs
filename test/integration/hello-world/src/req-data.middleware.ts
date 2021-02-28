import { StellaMiddleware } from "../../../../src/interfaces/Middleware";
import { NextFunction } from "express";
import { StellaRequest } from "../../../../src/interfaces/StellaRequest";
import { StellaResponse } from "../../../../src/interfaces/StellaResponse";
import { Service } from "../../../../src/decorators/Service";

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
  }
}
