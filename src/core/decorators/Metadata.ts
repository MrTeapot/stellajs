
export const Metadata = <Key = string, Value = any>(
  metadataKey: Key,
  value: Value
) => {
  const decoratorFactory = (target: object, key?: any, descriptor?: any) => {
    debugger
    if (descriptor) {
      Reflect.defineMetadata(metadataKey, value, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(metadataKey, value, target);
    return target;
  };
  decoratorFactory.KEY = metadataKey;
  return decoratorFactory;
};