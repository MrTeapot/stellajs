import Ajv from "ajv";
import { transformAjvErrors } from "../exceptions/ajvErrorConverter";
import { ClientError } from "../exceptions/ClientError";
import { ENDPOINT_METADATA } from "../Constants";
import { EndpointOptions } from "../interfaces/EndpointOptions";
import { EndpointMetadata } from "../interfaces/EndpointMetadata";
import { StellaRequest } from "../interfaces/StellaRequest";
import { StellaResponse } from "../interfaces/StellaResponse";

export enum HTTPMethod {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
  PATCH = "patch"
}

export type StellaEndpoint = (req: StellaRequest) => any;

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
      req: StellaRequest,
      res: StellaResponse,
      next: any
    ) {
      try {
        if (options.schema) {
          const valid = validate(req.getBody());
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

        const data = await originalMethod.apply(this, [req]);

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
        res.setStatus(statusCode);
        res.send(data);
        await next();
      } catch (err) {
        await next(err);
      }
    };

    const metadata: EndpointMetadata[] = [
      ...(Reflect.getMetadata(ENDPOINT_METADATA, target.constructor) || []),
      {
        method: options.method,
        path: options.path || "",
        controller: target.constructor,
        target: target,
        functionName: propertyKey,
      },
    ];

    Reflect.defineMetadata(ENDPOINT_METADATA, metadata, target.constructor);

    return descriptor;
  };
}
