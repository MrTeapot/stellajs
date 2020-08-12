import Ajv from "ajv";
import { transformAjvErrors } from "../exceptions/ajvErrorConverter";
import { ClientError } from "../exceptions/ClientError";
import { ENDPOINT_METADATA } from "../Constants";
import { EndpointOptions } from "../interfaces/EndpointOptions";
import { EndpointMetadata } from "../interfaces/EndpointMetadata";
import { StellaRequest } from "../interfaces/StellaRequest";
import { container } from "tsyringe";
import { AbstractHTTPAdapter } from "../http/AbstractAdapter";

export enum HTTPMethod {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
  PATCH = "patch",
}

export type StellaEndpoint = (req:StellaRequest) => any;

/**
 * A method decorator that wraps the method in try/catch and passes errors to error
 * middleware
 *
 * @param  {} method The HTTP method used
 * @param  {} url The endpoint
 */
export function Endpoint(options: EndpointOptions) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    if (options.schema) {
      const ajv = new Ajv({
        jsonPointers: true,
        allErrors: true,
      });

      var validate = ajv.compile(options.schema);
    }

    descriptor.value = async function (
      ...args: any
    ) {
      const httpAdapter = container.resolve<AbstractHTTPAdapter>("HTTPAdapter");
      const stellaRequest = httpAdapter.getRequestWrapper(...args);
      const stellaResponse = httpAdapter.getResponseWrapper(...args);
      const stellaNextFunction = httpAdapter.getNextFunction(...args);

      try {
        if (options.schema) {
          const valid = validate(stellaRequest.getBody());
          if (
            !valid &&
            validate.errors !== null &&
            validate.errors !== undefined
          ) {
            throw new ClientError(
              transformAjvErrors(validate.errors, options.schema)
            );
          }
        }

        const data = await originalMethod.apply(this, [stellaRequest]);

        let statusCode: number | undefined = options.httpStatusCode;

        if (!statusCode) {
          switch (options.method) {
            case HTTPMethod.POST:
              statusCode = 201;
              break;
            default:
              statusCode = 200;
          }
        }
        stellaResponse.setStatus(statusCode);
        stellaResponse.send(data);
        
        if(stellaNextFunction) {
          stellaNextFunction();
        }

      } catch (err) {
        stellaRequest.setFailed(true);
        if(stellaNextFunction) {
          stellaNextFunction(err);
        } else {
          throw err;
        }
      }
    };

    const metadata: EndpointMetadata[] = [
      ...(Reflect.getMetadata(ENDPOINT_METADATA, target.constructor) || []),
      {
        method: options.method,
        path: options.path || "",
        controller: target.constructor,
        target: target,
        functionName: propertyKey
      },
    ];

    Reflect.defineMetadata(ENDPOINT_METADATA, metadata, target.constructor);

    return descriptor;
  };
}
