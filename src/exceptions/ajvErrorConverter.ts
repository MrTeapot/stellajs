import pointer from 'json-pointer';
import { ErrorObject } from 'ajv';

export function transformAjvErrors(errors: ErrorObject[], schema: object) {
  return errors.map(function (error) {
    if (isMissing(error.params)) {
      const field = error.params.missingProperty;
      const message = capitalizeFirstLetter(`${field} is required`);
      return {
        field,
        message: message || ''
      }
    }
    const property = pointer.get(schema, '/properties' + error.dataPath);
    if (error.keyword == 'format' && property.example) {
      return {
        message: ''
      }
    }
    const field = error.dataPath.substring(error.dataPath.lastIndexOf('/') + 1, error.dataPath.length);
    return {
      field,
      message: capitalizeFirstLetter(error.message || '')
    };
  });
}

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function isMissing(value: ErrorObject["params"]): value is RequiredParams {
  return value.hasOwnProperty('missingProperty');
}

interface RequiredParams {
  missingProperty: string;
}