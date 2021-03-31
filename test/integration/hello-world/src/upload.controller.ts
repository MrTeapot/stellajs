import { Controller } from "../../../../src/decorators/Controller";
import { Endpoint, HTTPMethod } from "../../../../src/decorators/Endpoint";
import { HelloService } from "./hello.service";
import { LoggerMiddleware } from "./logger.middleware";
import { UseMiddleware } from "../../../../src/decorators/UseMiddleware";
import { StellaRequest } from "../../../../src/interfaces/StellaRequest";
import { Upload } from "../../../../src/decorators";

@Controller("/uploads")
@UseMiddleware(LoggerMiddleware)
export class UploadController {
  constructor(private helloService: HelloService) { }

  @Endpoint({
    method: HTTPMethod.POST
  })
  @Upload('image', {
    dest: './'
  })
  public async uploadFile(req: StellaRequest) {
    console.log(req.getFiles(), 'lool')
    return {
      hello: 'world'
    }
  }

}
