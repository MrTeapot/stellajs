import { StellaRequest } from "./StellaRequest";
import { StellaResponse } from "./StellaResponse";

export interface ExceptionHandler {
    catch(request: StellaRequest, response: StellaResponse, exception: Error): Promise<void>;
}