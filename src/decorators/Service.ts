import { injectable, singleton as single } from "tsyringe";

export function Service(singleton: boolean = true) {

    return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
        // Make the controller an injectable service

        console.log('THIS SHOULD NOT GET CALLED');

        if (singleton) {
            single()(constructor);
        } else {
            injectable()(constructor);
        }
    }
}