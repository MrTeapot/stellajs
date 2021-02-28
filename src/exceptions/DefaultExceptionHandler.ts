import { ExceptionHandler, StellaRequest } from "../interfaces";
import { StellaResponse } from "../interfaces/StellaResponse";
import { AppError } from "./AppError";

export class BaseExceptionHandler implements ExceptionHandler {
  async catch(req: StellaRequest, res: StellaResponse, error: AppError) {
    if (error instanceof AppError) {
      res.setStatus(error.statusCode)
        .send({
          success: false,
          errors: error.errors,
        });
    } else {
      res.setStatus(500);
      if (process.env.NODE_ENV === 'production') {
        res.send({
          sucess: false,
          errors: ['An unexpected error occured']
        });
      } else {
        res.send({
          succes: false,
          errors: [error]
        })
      }
    }
  }
}