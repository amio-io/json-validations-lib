class SchemaValidatorError extends Error{
  constructor(message, field = undefined, rejectedValue = undefined) {
    super()
    this.field = field
    this.rejected_value = rejectedValue
    this.message = message
  }

  toObject(){
    return {
      message: this.message,
      field: this.field,
      rejected_value: this.rejected_value
    }
  }
}

module.exports = SchemaValidatorError
