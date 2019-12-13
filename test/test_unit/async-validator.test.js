const chai = require('chai')
const expect = chai.expect
const AsyncValidatorTest = require('../utils/async-validator-test')
chai.use(require('chai-as-promised'))

describe('async-validator test', async () => {
    const asyncValidatorTest = new AsyncValidatorTest()

    it('Validation passed', async () => {
        const result = await asyncValidatorTest.validate({valid: true})
        expect(result).to.be.true
    })

    it('Validation failed', async () => {
        const result = asyncValidatorTest.validate({valid: false})
        await expect(result).to.be.rejectedWith('expected "valid" to be true').eventually.include({
            message: 'expected "valid" to be true',
            field: 'valid',
            rejected_value: false
        })
    })

})
