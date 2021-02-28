import { NextFunction } from "express";
import { StellaRequest } from "./StellaRequest";
import { StellaResponse } from "./StellaResponse";

export interface StellaMiddleware {
    before?(req: StellaRequest, res: StellaResponse, next: NextFunction): Promise<any>;
    after?(req: StellaRequest, res: StellaResponse, next: NextFunction): Promise<any>;
}