import { StellaApplication } from "../../../src/core";
import { HelloController } from "./src/hello.controller";
import request from "supertest";
import { expect } from "chai";
import { ExpressAdapter, FastifyAdapter } from "../../../src/core/http";
import { constructor } from "tsyringe/dist/typings/types";
import { AbstractHTTPAdapter } from "../../../src/core/http/AbstractAdapter";

tests(ExpressAdapter, 'Express');
tests(FastifyAdapter, 'Fastify');

function tests (adapter: constructor<AbstractHTTPAdapter>, adapterName: string) {
  describe(`The HelloWorld app with ${adapterName} adapter`, () => {
  let application: StellaApplication;
  let httpServer: any;
  beforeEach(async () => {
    application = new StellaApplication({
      port: 3333,
      controllers: [HelloController],
      httpAdapter: adapter
    });
    await application.bootstrap();
    httpServer = application.getHTTPServer();
    //console.time("Execution time");
  });

  afterEach(() => {
    //console.timeEnd("Execution time");
    application.shutdown();
  });

  it("Should return hello world from the helloWorld endpoint", async () => {
    return request(httpServer).get("/hello").expect((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.hello).to.equal("world");
    });
  });

  it("Should return world from the createWorld endpoint, status code 201", async () => {
    return request(httpServer).post("/hello").send({ name: "A World" }).expect(201);
  });

  it("Should return 400 status from the createWorld endpoint when bad name", async () => {
    return request(httpServer).post("/hello").send({ name: "World" }).expect(400);
  });

  it("Should return 400 status from the createWorld endpoint when missing name", async () => {
    return request(httpServer).post("/hello").send({}).expect(400);
  });

  it("Should return proper error response from the createWorld endpoint when missing name", async () => {
    return request(httpServer).post("/hello").send({}).expect((res) => {
      expect(res.body.success).to.equal(false);
      expect(res.body.errors[0].message).to.be.a('string');
    });
  });

  it("Should return 404 on route that does not exist", async () => {
    return request(httpServer).get("/nonexisting").send({}).expect(404);
  });

  it("Should return 418 on route with custom http status code", async () => {
    return request(httpServer).get("/hello/teapot").send({}).expect(418);
  });

  it("Should read and return route param", async () => {
    return request(httpServer).get("/hello/world2").send({}).expect((res) => {
      expect(res.body.hello).to.equal('world2');
    });
  });

  it("Should 200 on endpoint with req-data", async () => {
    return request(httpServer).get("/hello/req-data").send({}).expect((res) => {
      expect(res.body.name).to.equal('Hello');
      expect(res.body.hello).to.equal('world');
    });
  });

});
}
