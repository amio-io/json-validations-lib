const R = require('ramda')
const SchemaValidatorError = require('../errors/schema-validator-error')

function convertValidationError(error) {
  const errorObject = Array.isArray(error) ? error[0] : error

  const propName = errorObject.dataPath.split('.').pop()
  const params = errorObject.params

  switch(errorObject.keyword) {
    // TODO Create different error messages for objects and strings #4
    case 'type':
      return new SchemaValidatorError(`Property '${propName}' must be ${params.type}.`, errorObject.dataPath, errorObject.data)
    case 'additionalProperties':
      return new SchemaValidatorError(`Property '${params.additionalProperty}' is not supported.`,
        errorObject.dataPath + '.' + params.additionalProperty)
    case 'required': {
      const fieldPath = errorObject.dataPath || '.'
      return new SchemaValidatorError(`Missing property '${params.missingProperty}'.`, fieldPath)
    }
    case 'const':
      return new SchemaValidatorError(`Property '${propName}' must have value '${params.allowedValue}'.`, errorObject.dataPath, errorObject.data)
    case 'enum':
      return convertEnum(errorObject.data, errorObject.dataPath, params, propName, errorObject.schemaPath)
    case 'keys_not_equal': {
      const message = `Provided keys do not match expected keys: ${params.originalKeys}.`
      return new SchemaValidatorError(message, errorObject.dataPath, errorObject.data)
    }
    case 'not_found':// this case use to be async
      const notFoundPropName = params.notFoundPropName
      const message = `Cannot find ${notFoundPropName} with id ${errorObject.data}.`
      return new SchemaValidatorError(message, errorObject.dataPath, errorObject.data)
    case 'format':
      if(errorObject.params.format === 'httpUrl') {
        const message = `Property '${propName}' must be a valid URL. Current value is "${errorObject.data}"`
        return new SchemaValidatorError(message, errorObject.dataPath, errorObject.data)
      }
    // Intentional fall through
    default:
      return new SchemaValidatorError(`Property '${propName}' ${errorObject.message}`, errorObject.dataPath, errorObject.data)
  }
}

function convertEnum(data, dataPath, params, propName, schemaPath) {
  const schemaParent = R.pipe( // #/propertyNames/enum
    R.split('/'), // ['#', 'propertyNames', 'enum']
    R.dropLast(1), // ['#', 'propertyNames']
    R.last // 'propertyNames'
  )(schemaPath)

  if(schemaParent === 'propertyNames') {
    const path = dataPath || '.'
    const message = `Property '${data}' at '${path}' does not match any allowed property: ${params.allowedValues.join(', ')}.`
    const fieldPath = `${dataPath}.${data}`
    return new SchemaValidatorError(message, fieldPath)
  }

  const message = `Property '${propName}' with value '${data}' does not match any allowed value: ${params.allowedValues.join(', ')}.`
  return new SchemaValidatorError(message, dataPath, data)

}

module.exports = {
  convertValidationError
}
