const expect = require('chai').expect
const SchemaValidator = require('../../src/schema-validator')

describe('validation-error-converter test', () => {

    it('type', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                typeError: {
                    type: 'string'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            typeError: {}
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.typeError',
            message: "Property 'typeError' must be string.",
            rejected_value: data.typeError
        })
    })

    it('additionalProperties', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                additionalPropertyError: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        a: {
                            type: 'string'
                        }
                    }
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            additionalPropertyError: {
                d: {}
            }
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.additionalPropertyError.d',
            message: "Property 'd' is not supported."
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
                    required: ['a'],
                    properties: {
                        a: {
                            type: 'string'
                        }
                    }
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            requiredError: {}
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.requiredError',
            message: "Missing property 'a'."
        })
    })

    it('const', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                constError: {
                    type: 'string',
                    const: 'dummy'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            constError: 'a'
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.constError',
            message: "Property 'constError' must have value 'dummy'.",
            rejected_value: 'a'
        })
    })

    it('enum - values', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                enumError: {
                    type: 'string',
                    enum: [
                        '1',
                        '2',
                        '3'
                    ]
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            enumError: 'a'
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.enumError',
            message: "Property 'enumError' with value 'a' does not match any allowed value: 1, 2, 3.",
            rejected_value: 'a'
        })
    })

    it('enum - properties', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                propEnumError: {
                    type: 'object',
                    propertyNames: {
                        enum: [
                            'a',
                            'b',
                            'c'
                        ]
                    }
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            propEnumError: {d: {}}
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.propEnumError.d',
            message: "Property 'd' at '.propEnumError' does not match any allowed property: a, b, c.",
        })
    })

    it('format URL', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                formatUrlError: {
                    type: 'string',
                    format: 'httpUrl'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            formatUrlError: 'dummy'
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.formatUrlError',
            message: `Property 'formatUrlError' must be a valid URL. Current value is "dummy"`,
            rejected_value: 'dummy'
        })
    })

    it('format other', () => {
        const schema = {
            $id: 'http://example.com/schemas/schema.json',
            type: 'object',
            additionalProperties: false,
            properties: {
                formatError: {
                    type: 'string',
                    format: 'email'
                }
            }
        }
        const schemaValidator = new SchemaValidator(schema.$id, [schema])

        const data = {
            formatError: 'dummy'
        }

        const result = schemaValidator.validate.bind(schemaValidator, data)
        expect(result).to.throw().to.include({
            field: '.formatError',
            message: `Property 'formatError' should match format "email"`,
            rejected_value: 'dummy'
        })
    })
})
