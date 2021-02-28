import { injectable, singleton as single } from "tsyringe";

function Service(singleton: boolean = true) {
  return function classDecorator<T extends { new (...args: any[]): {} }>(
    constructor: T
  ) {
    
    if (singleton) {
      single()(constructor);
    } else {
      injectable()(constructor);
    }
  };
}

export { Service };
