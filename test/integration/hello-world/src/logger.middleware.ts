import { StellaMiddleware } from "../../../../src/core/interfaces/Middleware";
import { StellaRequest } from "../../../../src/core/interfaces/StellaRequest";
import { StellaResponse } from "../../../../src/core/interfaces/StellaResponse";

export class LoggerMiddleware implements StellaMiddleware {

  async before(req: StellaRequest, res: StellaResponse) {
  }

  async after(req: StellaRequest, res: StellaResponse) {
  }
}
