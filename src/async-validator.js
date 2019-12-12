class AsyncValidator {

  async validate(data) {
    throw Error('validate() must be implemented in children')
  }

  /** Follows AJV error to be compatible with Schema errors */
  createError(path = [], keyword, data, params) {
    return {
      dataPath: path.join('.'),
      keyword,
      data,
      params
    }
  }

}

module.exports = AsyncValidator
