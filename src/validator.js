const yup = require('yup');
class Validator {
  constructor(props) {}
  async validateLocaleContent(jsonData) {
    const objectPropertySchema = yup.object({
      message: yup.string().required('Message is required'),
      description: yup.string().required('Description is required'),
    });
    const propertySchema = yup
      .mixed()
      .test(
        'is-valid-property',
        'Property must be a string or an object with message and description',
        (value) => {
          if (typeof value === 'string') {
            return true; // Accepts string values
          }
          if (typeof value === 'object' && value !== null) {
            return objectPropertySchema.isValidSync(value); // Validates the object format
          }
          return false; // Invalid if neither a string nor a valid object
        }
      );
    const schema = yup
      .object()
      .test(
        'is-valid-object',
        'Each key should be an object with message and description',
        (value) => {
          // Ensure each property is validated
          return Object.values(value).every((prop) =>
            propertySchema.isValidSync(prop)
          );
        }
      )
      .test(
        'consistent-property-types',
        'All properties must be either strings or valid objects, but not a mix of both',
        (value) => {
          const values = Object.values(value);
          const allStrings = values.every((v) => typeof v === 'string');
          const allObjects = values.every(
            (v) =>
              typeof v === 'object' &&
              v !== null &&
              objectPropertySchema.isValidSync(v)
          );
          return allStrings || allObjects;
        }
      );
    return schema.validate(jsonData);
  }
}
exports.Validator = Validator;
