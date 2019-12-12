const Ajv = require('ajv')
const errorConverter = require('./utils/validation-errors-converter')
const urlValidator = require('valid-url')
const debug = require('logzio-node-debug').debug('json-validations-lib:' + require('path').basename(__filename))

class SchemaValidator {

  constructor(schemaId, schemas) {
    this.schemaValidator = new Ajv({verbose: true, schemas: schemas}) // verbose to enable errors.data field
    this.schemaValidator.addFormat('httpUrl', urlValidator.isWebUri)
    this._validate = this.schemaValidator.getSchema(schemaId)
  }

  /** @returns null OR error*/
  validate(data) {
    const valid = this._validate(data)
    if(valid) return null

    const validationErrors = this._validate.errors
    debug('schema validation failed', this._validate.errors)
    throw errorConverter.convertValidationError(validationErrors)
  }
}

module.exports = SchemaValidator
