function arrayNotNull(array) {
  if (array !== undefined && array !== null && Array.isArray(array) && array.length > 0) {
    return true
  }
  return false
}

function notNull(data) {
  if (data !== undefined && data !== null && data !== '') {
    return true
  }
  return false
}

export { arrayNotNull, notNull }
