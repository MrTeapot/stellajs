import { Metadata } from "../../../../src/decorators/Metadata";
import { PermissionMiddleware } from "./permission.middleware";
import { UseMiddleware } from "../../../../src/decorators/UseMiddleware";

export const Permission = (permission: string) => {
  return Metadata("permission", permission, [UseMiddleware(PermissionMiddleware)]);
};
