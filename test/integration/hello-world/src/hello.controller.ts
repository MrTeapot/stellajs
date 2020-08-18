import { Controller } from "../../../../src/core/decorators/Controller";
import { Endpoint, HTTPMethod } from "../../../../src/core/decorators/Endpoint";
import { HelloService } from "./hello.service";
import { WorldSchema } from "./world.schema";
import { LoggerMiddleware } from "./logger.middleware";
import { UseMiddleware } from "../../../../src/core/decorators/UseMiddleware";
import { StellaRequest } from "../../../../src/core/interfaces/StellaRequest";
import { User, RequestData } from "./req-data.middleware";
import { Permission } from "./permission.decorator";

@Controller("/hello")
@UseMiddleware(LoggerMiddleware)
export class HelloController {
  constructor(private helloService: HelloService) { }

  @Endpoint({
    method: HTTPMethod.GET,
  })
  public async helloWorld(req: StellaRequest) {
    return {
      hello: 'world'
    }
  }

  @Endpoint({
    method: HTTPMethod.POST,
    schema: WorldSchema,
  })
  public async createWorld(req: StellaRequest) {
    return {
      hello: 'world'
    }
  }

  @Endpoint({
    method: HTTPMethod.GET,
    path: '/req-data'
  })
  @UseMiddleware(RequestData)
  public async reqDataTest(req: StellaRequest) {
    return req.getData<User>('user');
  }

  @Endpoint({
    method: HTTPMethod.GET,
    path: '/forbidden'
  })
  @Permission('king')
  public async forbidden(req: StellaRequest) {
    return '';
  }

  @Endpoint({
    method: HTTPMethod.GET,
    path: '/teapot',
    httpStatusCode: 418
  })
  public async helloTeapot(req: StellaRequest) {
    return {
      hello: 'world'
    }
  }

  @Endpoint({
    method: HTTPMethod.GET,
    path: '/:id'
  })
  public async helloWorldParam(req: StellaRequest) {
    return {
      hello: req.getParams().id
    }
  }

}
