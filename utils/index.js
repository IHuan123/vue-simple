const toStirng = Object.prototype.toString
const isObj = (value)=> toStirng.call(value) === "[object Object]"