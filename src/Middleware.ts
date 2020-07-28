import { Request, Response, NextFunction } from "express";

export abstract class Middleware {
    abstract use(req: Request, res: Response, next: NextFunction): Promise<any>;
}