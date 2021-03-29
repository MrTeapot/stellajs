import { Options } from "multer";
import "reflect-metadata";
import { UPLOAD } from "../Constants";

export function Upload(fieldName: string, options?: Options) {
  return function (target: Object | Function, methodName: string) {
    Reflect.defineMetadata(UPLOAD, {
      fieldName, options
    }, target, methodName);
  };
}


