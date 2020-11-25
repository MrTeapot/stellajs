import { AppError } from "../../../../src/core/exceptions";
import { ExceptionHandler, StellaRequest } from "../../../../src/core/interfaces";
import { StellaResponse } from "../../../../src/core/interfaces/StellaResponse";
import { HelloException } from "./HelloException";
import { Catch } from "../../../../src/core/decorators";

@Catch(HelloException)
export class HelloExceptionHandler implements ExceptionHandler {
  async catch(request: StellaRequest, response: StellaResponse, error: AppError) {
    response.setStatus(error.statusCode).send({msg: 'Hello Error!'});
  }
}