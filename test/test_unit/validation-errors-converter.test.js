const expect = require('chai').expect
const SchemaValidator = require('../../src/schema-validator')

describe('validation-error-converter test', () => {

    it('type', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object'
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, 'invalid-type')
        expect(result).to.throw().to.include({
            field: '',
            message: "Property '' must be object.",
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
            required: ['requiredProperty'],
            properties: {
                requiredProperty: {
                    type: 'string'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, {})
        expect(result).to.throw().to.include({
            field: '.',
            message: "Missing property 'requiredProperty'."
        })
    })

    it('const', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'string',
            const: 'valid_value'
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, 'invalid_value')
        expect(result).to.throw().to.include({
            field: '',
            message: "Property '' must have value 'valid_value'.",
            rejected_value: 'invalid_value'
        })
    })

    it('enum - values', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'string',
            enum: [
                'valid-1',
                'valid-2',
                'valid-3'
            ]
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, 'invalid')
        expect(result).to.throw().to.include({
            field: '',
            message: "Property '' with value 'invalid' does not match any allowed value: valid-1, valid-2, valid-3.",
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
            type: 'string',
            format: 'httpUrl'
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, 'invalid-url')
        expect(result).to.throw().to.include({
            field: '',
            message: `Property '' must be a valid URL. Current value is "invalid-url"`,
            rejected_value: 'invalid-url'
        })
    })

    it('format other', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'string',
            format: 'email'
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const result = schemaValidator.validate.bind(schemaValidator, 'invalid-email')
        expect(result).to.throw().to.include({
            field: '',
            message: `Property '' should match format "email"`,
            rejected_value: 'invalid-email'
        })
    })
})
