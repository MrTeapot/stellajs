import "reflect-metadata";
import "mocha";
import chai, { expect } from "chai";
import * as sinon from "sinon";
import sinonChai from "sinon-chai";
chai.use(sinonChai);

import { Controller } from "../../../src/core/decorators/Controller";
import { CONTROLLER_METADATA } from "../../../src/core/Constants";
import * as Service from "../../../src/core/decorators/Service";
import { constructor } from "tsyringe/dist/typings/types";

describe("The Controller decorator", () => {
  let defineMetadata: sinon.SinonStub;
  let serviceDecoratorStub: sinon.SinonStub;
  let spy: sinon.SinonSpy;
  let Foo: constructor<any>;

  beforeEach(function () {
    defineMetadata = sinon.stub(Reflect, "defineMetadata").returns();
    Foo = class Foo {};
    spy = sinon.spy();
    serviceDecoratorStub = sinon.stub(Service, "Service").returns(spy);
  });

  afterEach(function () {
    defineMetadata.restore();
    serviceDecoratorStub.restore();
  });

  it("Should define the correct metadata", async () => {
    // Act
    const controller = Controller("test url");
    controller(Foo);
    // Assert
    expect(Reflect.defineMetadata).to.have.been.calledWith(
      CONTROLLER_METADATA,
      {
        class: Foo,
        url: "test url",
      }
    );
  });

  it("Should register the controller as a service", async () => {
    // Act
    const controller = Controller("test url");
    controller(Foo);

    // Assert
    expect(spy).to.have.been.calledWith(Foo);
  });
});
