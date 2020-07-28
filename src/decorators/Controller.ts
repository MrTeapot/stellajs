
import { CONTROLLER_METADATA } from '../Constants';
import { constructor } from 'tsyringe/dist/typings/types';
import { Service } from './Service';

export function Controller(url: string) {

  return function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {

    Reflect.defineMetadata(CONTROLLER_METADATA, {
      url,
      class: constructor
    }, constructor);

    // Make the controller an injectable service
    Service()(constructor);

  }
}

export interface ControllerMetadata {
  url: string;
  class: constructor<any>
}