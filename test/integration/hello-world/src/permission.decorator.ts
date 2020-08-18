import { Metadata } from "../../../../src/core/decorators/Metadata";
import { PermissionMiddleware } from "./permission.middleware";
import { UseMiddleware } from "../../../../src/core/decorators/UseMiddleware";

export const Permission = (permission: string) => {
  return Metadata("permission", permission, [UseMiddleware(PermissionMiddleware)]);
};
