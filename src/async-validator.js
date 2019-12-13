const convertValidationError = require("./utils/validation-errors-converter");

class AsyncValidator {

  async validate(data) {
    throw Error('validate() must be implemented in children')
  }

  /** Follows AJV error to be compatible with Schema errors. */
  createError(path = [], keyword, data, params) {
    return convertValidationError({
      dataPath: path.join('.'),
      keyword,
      data,
      params
    })
  }

}

module.exports = AsyncValidator
