import { StellaApplication } from "../../../src";
import { HelloController } from "./src/hello.controller";
import request from "supertest";
import { expect } from "chai";
import { ExpressAdapter } from "../../../src/http";
import { constructor } from "tsyringe/dist/typings/types";
import { AbstractHTTPAdapter } from "../../../src/http/AbstractAdapter";
import { HelloExceptionHandler } from './src/ErrorHandler'

tests(ExpressAdapter, 'Express');

function tests(adapter: constructor<AbstractHTTPAdapter>, adapterName: string) {
  describe(`The HelloWorld app with ${adapterName} adapter`, () => {
    let application: StellaApplication;
    let httpServer: any;
    beforeEach(async () => {
      application = new StellaApplication({
        port: 3333,
        controllers: [
          HelloController
        ],
        httpAdapter: adapter,
        exceptionHandlers: [
          HelloExceptionHandler
        ]
      });
      await application.bootstrap();
      httpServer = application.getHTTPServer();
    });

    afterEach(() => {
      application.shutdown();
    });

    it("1. Should return hello world from the helloWorld endpoint", async () => {
      return request(httpServer).get("/hello").expect((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.hello).to.equal("world");
      });
    });

    it("2. Should return world from the createWorld endpoint, status code 201", async () => {
      return request(httpServer).post("/hello").send({ name: "A World" }).expect((res) => {
        expect(res.status).to.equal(201);
      });

    });

    it("3. Should return 400 status from the createWorld endpoint when bad name", async () => {
      return request(httpServer).post("/hello").send({ name: "World" }).expect(400);
    });

    it("4. Should return 400 status from the createWorld endpoint when missing name", async () => {
      return request(httpServer).post("/hello").send({}).expect(400);
    });

    it("5. Should return proper error response from the createWorld endpoint when missing name", async () => {
      return request(httpServer).post("/hello").send({}).expect((res) => {
        expect(res.body.success).to.equal(false);
        expect(res.body.errors[0].message).to.be.a('string');
      });
    });

    it("6. Should return 404 on route that does not exist", async () => {
      return request(httpServer).get("/nonexisting").send({}).expect(404);
    });

    it("7. Should return 418 on route with custom http status code", async () => {
      return request(httpServer).get("/hello/teapot").send({}).expect(418);
    });

    it("8. Should read and return route param", async () => {
      return request(httpServer).get("/hello/world2").send({}).expect((res) => {
        expect(res.body.hello).to.equal('world2');
      });
    });

    it("9. Should read and return route param on patch", async () => {
      return request(httpServer).patch("/hello/world2").send({}).expect((res) => {
        expect(res.body.hello).to.equal('world2');
      });
    });

    it("10. Should return user on endpoint with req-data", async () => {
      return request(httpServer).get("/hello/req-data").send({}).expect((res) => {
        expect(res.body.name).to.equal('Hello');
        expect(res.body.hello).to.equal('world');
      });
    });

    it("11. Should return 403 on endpoint with permission control", async () => {
      return request(httpServer).get("/hello/forbidden").send({}).expect(403);
    });

    it("12. Should return 200 on endpoint with permission control but valid header", async () => {
      return request(httpServer).get("/hello/forbidden").set('permission', 'king').send({}).expect(200);
    });

    it("13. Should return 500 on endpoint that throws error", async () => {
      return request(httpServer).get("/hello/error").send({}).expect(500);
    });

    it("14. Should run custom exception handler when throwing HelloWorldException", async () => {
      return request(httpServer).get("/hello/hello-error").send({}).expect((res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('Hello Error!');
      });
    });

    it("15. Should return a custom header when set", async () => {
      return request(httpServer).get("/hello/header-test").send({}).expect((res) => {
        expect(res.header['my-header']).to.equal('hello-world');
      });
    });

  });
}
