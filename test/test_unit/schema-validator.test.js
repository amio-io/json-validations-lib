const expect = require('chai').expect
const SchemaValidator = require('../../src/schema-validator')

describe('Schema Validator', () => {

  const schema = {
    $id: 'http://example.com/schemas/schema.json',
    type: 'object',
    required: [
      'a'
    ]
  }
  const schemaValidator = new SchemaValidator(schema.$id, [schema])

  it('Validation passed', () => {
    const error = schemaValidator.validate({a: 1})
    expect(error).to.be.null
  })

  it('Validation failed', () => {
    const error = schemaValidator.validate.bind(schemaValidator,{})
    expect(error).to.throw().to.include({
      field: '.',
      message: "Missing property '.a'."
    })
  })
})
