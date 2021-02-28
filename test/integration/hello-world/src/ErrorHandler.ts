import { AppError } from "../../../../src/exceptions";
import { ExceptionHandler, StellaRequest } from "../../../../src/interfaces";
import { StellaResponse } from "../../../../src/interfaces/StellaResponse";
import { HelloException } from "./HelloException";
import { Catch } from "../../../../src/decorators";

@Catch(HelloException)
export class HelloExceptionHandler implements ExceptionHandler {
  async catch(request: StellaRequest, response: StellaResponse, error: AppError) {
    response.setStatus(error.statusCode).send({msg: 'Hello Error!'});
  }
}