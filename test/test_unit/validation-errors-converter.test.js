const expect = require('chai').expect
const SchemaValidator = require('../../src/schema-validator')

describe('validation-error-converter test', () => {

    it('type', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            properties: {
                typeError: {
                    type: 'object'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {typeError: 'invalid-type'})
        expect(result).to.throw().to.include({
            field: '.typeError',
            message: "Property 'typeError' must be object.",
            rejected_value: 'invalid-type'
        })
    })

    it('additionalProperties', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                valid: {
                    type: 'string'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {invalid: {}})
        expect(result).to.throw().to.include({
            field: '.invalid',
            message: "Property 'invalid' is not supported."
        })
    })

    it('required', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                requiredError: {
                    type: 'object',
                    required: ['requiredProperty'],
                    properties: {
                        requiredProperty: {
                            type: 'string'
                        }
                    }
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {requiredError: {}})
        expect(result).to.throw().to.include({
            field: '.requiredError',
            message: "Missing property 'requiredProperty'."
        })
    })

    it('const', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            properties: {
                constError: {
                    type: 'string',
                    const: 'valid_value'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {constError: 'invalid_value'})
        expect(result).to.throw().to.include({
            field: '.constError',
            message: "Property 'constError' must have value 'valid_value'.",
            rejected_value: 'invalid_value'
        })
    })

    it('enum - values', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            properties: {
                enumError: {
                    type: 'string',
                    enum: [
                        'valid-1',
                        'valid-2',
                        'valid-3'
                    ]
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {enumError: 'invalid'})
        expect(result).to.throw().to.include({
            field: '.enumError',
            message: "Property 'enumError' with value 'invalid' does not match any allowed value: valid-1, valid-2, valid-3.",
            rejected_value: 'invalid'
        })
    })

    it('enum - properties', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            propertyNames: {
                enum: [
                    'valid-prop-1',
                    'valid-prop-2',
                    'valid-prop-3'
                ]
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {invalid: {}})
        expect(result).to.throw().to.include({
            field: '.invalid',
            message: "Property 'invalid' at '.' does not match any allowed property: valid-prop-1, valid-prop-2, valid-prop-3.",
        })
    })

    it('format URL', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            properties: {
                formatError: {
                    type: 'string',
                    format: 'httpUrl'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {formatError: 'invalid-url'})
        expect(result).to.throw().to.include({
            field: '.formatError',
            message: `Property 'formatError' must be a valid URL. Current value is "invalid-url"`,
            rejected_value: 'invalid-url'
        })
    })

    it('format other', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            properties: {
                formatError: {
                    type: 'string',
                    format: 'email'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {formatError: 'invalid-email'})
        expect(result).to.throw().to.include({
            field: '.formatError',
            message: `Property 'formatError' should match format "email"`,
            rejected_value: 'invalid-email'
        })
    })
})
