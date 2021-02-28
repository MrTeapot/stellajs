import { StellaMiddleware } from "../../../../src/interfaces/Middleware";
import { StellaRequest } from "../../../../src/interfaces/StellaRequest";
import { StellaResponse } from "../../../../src/interfaces/StellaResponse";

export class LoggerMiddleware implements StellaMiddleware {

  async before(req: StellaRequest, res: StellaResponse) {
  }

  async after(req: StellaRequest, res: StellaResponse) {
  }
}
