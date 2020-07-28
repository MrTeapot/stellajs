import Ajv from 'ajv';
import { Request, Response, NextFunction } from "express";
import { constructor } from 'tsyringe/dist/typings/types';
import { transformAjvErrors } from '../errors/ajvErrorConverter';
import { BadInput } from '../errors/BadInput';
import { ENDPOINT_METADATA } from '../Constants';

export enum HTTPMethod {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete',
  PATCH = 'patch'
}

export interface EndpointOptions {
  schema?: object;
  permission?: string;
}

export interface EndpointMetadata {
  method: HTTPMethod;
  url: string;
  controller: constructor<any>;
  target: Function;
  functionName: string;
  permission: string
}

/**
 * A method decorator that wraps the method in try/catch and passes errors to error
 * middleware
 *  
 * @param  {} method The HTTP method used
 * @param  {} url The endpoint
 */
export function Endpoint(method: HTTPMethod, url: string, options: EndpointOptions = {}) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    if (options.schema) {
      const ajv = new Ajv({
        jsonPointers: true,
        allErrors: true
      });

      var validate = ajv.compile(options.schema);
    }

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        if (options.schema) {
          const valid = validate(req.body);
          if (!valid && validate.errors !== null && validate.errors !== undefined) {
            throw new BadInput(transformAjvErrors(validate.errors, options.schema));
          }
        }
        return await originalMethod.apply(this, req, res, next);
      } catch (err) {
        next(err)
      }
    }

    const metadata = [
      ...Reflect.getMetadata(ENDPOINT_METADATA, target.constructor) || [],
      {
        method,
        url,
        controller: target.constructor,
        target: target,
        functionName: propertyKey,
        permission: options.permission
      }
    ]

    Reflect.defineMetadata(ENDPOINT_METADATA, metadata, target.constructor);

    return descriptor;
  }
}