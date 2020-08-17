import { Metadata } from "../../../../src/core/decorators/Metadata";

export const Permission = (permission: string) => {
  return Metadata("permission", permission);
};
