export const Metadata = <Key = string, Value = any>(
  metadataKey: Key,
  value: Value,
  additionalDecorators?: Function[]
) => {
  const decoratorFactory = (target: object, key?: any, descriptor?: any) => {
    additionalDecorators?.map((decorator) => {
      const func = decorator(target, key);
      if (typeof func === "function") {
        func(target, key);
      }
    });
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
