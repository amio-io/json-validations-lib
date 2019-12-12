const expect = require('chai').expect
const SchemaValidator = require('../../src/schema-validator')

describe('validation-error-converter test', () => {

    const schema = {
        $id: 'http://example.com/schemas/schema.json',
        type: 'object',
        additionalProperties: false,
        properties: {
            typeError: {
                type: 'string'
            },
            additionalPropertyError: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    a: {
                        type: 'string'
                    }
                }
            },
            requiredError: {
                type: 'object',
                required: ['a'],
                properties: {
                    a: {
                        type: 'string'
                    }
                }
            },
            constError: {
                type: 'string',
                const: 'dummy'
            },
            enumError: {
                type: 'string',
                enum: [
                    '1',
                    '2',
                    '3'
                ]
            },
            propEnumError: {
                type: 'object',
                propertyNames: {
                    enum: [
                        'a',
                        'b',
                        'c'
                    ]
                }
            },
            formatUrlError: {
                type: 'string',
                format: 'httpUrl'
            },
            formatError: {
                type: 'string',
                format: 'email'
            }
        }
    }
    const schemaValidator = new SchemaValidator(schema.$id, [schema])

    it('type', () => {
        const data = {
            typeError: {}
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.typeError',
            message: "Property 'typeError' must be string.",
            rejected_value: data.typeError
        })
    })

    it('additionalProperties', () => {
        const data = {
            additionalPropertyError: {
                d: {}
            }
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.additionalPropertyError.d',
            message: "Property 'd' is not supported."
        })
    })

    it('required', () => {
        const data = {
            requiredError: {}
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.requiredError',
            message: "Missing property 'a'."
        })
    })

    it('const', () => {
        const data = {
            constError: 'a'
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.constError',
            message: "Property 'constError' must have value 'dummy'.",
            rejected_value: 'a'
        })
    })

    it('enum - values', () => {
        const data = {
            enumError: 'a'
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.enumError',
            message: "Property 'enumError' with value 'a' does not match any allowed value: 1, 2, 3.",
            rejected_value: 'a'
        })
    })

    it('enum - properties', () => {
        const data = {
            propEnumError: {d: {}}
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.propEnumError.d',
            message: "Property 'd' at '.propEnumError' does not match any allowed property: a, b, c.",
        })
    })

    it('format URL', () => {
        const data = {
            formatUrlError: 'dummy'
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.formatUrlError',
            message: `Property 'formatUrlError' must be a valid URL. Current value is "dummy"`,
            rejected_value: 'dummy'
        })
    })

    it('format other', () => {
        const data = {
            formatError: 'dummy'
        }

        const result = schemaValidator.validate(data)
        expect(result).to.include({
            field: '.formatError',
            message: `Property 'formatError' should match format "email"`,
            rejected_value: 'dummy'
        })
    })
})
