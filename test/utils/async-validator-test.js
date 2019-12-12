const AsyncValidator = require('../../src/async-validator')
const SchemaValidatorError = require('../../src/errors/schema-validator-error')

class AsyncValidatorTest extends AsyncValidator {
    async validate(data) {
        if (data.valid) {
            return true
        }
        throw new SchemaValidatorError('expected "valid" to be true', 'valid', false)
    }
}

module.exports = AsyncValidatorTest
