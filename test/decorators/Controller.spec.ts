import "reflect-metadata"

import 'mocha'
import chai, { expect } from "chai";
import Sinon, * as sinon from 'sinon';
import sinonChai from "sinon-chai";
chai.use(sinonChai);

import { ImportMock } from 'ts-mock-imports';

import { Controller } from '../../src/decorators/Controller';
import { CONTROLLER_METADATA } from "../../src/Constants";
import * as ServiceModule from "../../src/decorators/Service";

describe("The Controller decorator", () => {

    it("Should define the correct metadata", async () => {

        // Arrange
        class Foo { }

        const reflectStub = sinon.stub(Reflect, "defineMetadata").returns();

        // Act
        const controller = Controller('test url');
        controller(Foo);

        // Assert
        expect(Reflect.defineMetadata).to.have.been.calledWith(CONTROLLER_METADATA, {
            class: Foo,
            url: "test url"
        });

        // Restore
        reflectStub.restore();
    })

    it("Should register the controller as a service", async () => {

        // Arrange
        class Foo { }
        const reflectStub = sinon.stub(Reflect, "defineMetadata").returns();

        const mockHandler = ImportMock.mockOther(ServiceModule, 'Service', sinon.stub().returns(function () { }));

        const decoratorFunction = sinon.stub();

        // Act
        const controller = Controller('test url');
        controller(Foo);

        // Assert
        expect(decoratorFunction).to.have.been.calledWith(Foo);

        // Restore
        reflectStub.restore();
        mockHandler.restore();
    })


});