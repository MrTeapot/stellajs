
export const Metadata = <Key = string, Value = any>(
  key: Key,
  value: Value
) => {
  const decoratorFactory = (target: object, key?: any, descriptor?: any) => {
    if (descriptor) {
      Reflect.defineMetadata(key, value, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(key, value, target);
    return target;
  };
  decoratorFactory.KEY = key;
  return decoratorFactory;
};