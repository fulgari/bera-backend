// 
// 
/**
 * Get date param `:id` from request url.
 * NB: A helper function to assert the request ID param is valid and convert it to a number (since it comes as a string by default)
 * @param {*} req 
 * @returns 
 */
function getIdParam(req) {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

/**
 * Get date param `:date` from request url
 * @param {*} req 
 * @returns 
 */
function getDateParam(req) {
  const date = req.params.date;
  if (isSimpleDate(date)) {
    return date;
  }
  throw new TypeError(`Invalid ':date' param: "${date}"`);
}

/**
 * Get period params (`:from`, `:to`) from request url
 * @param {*} req 
 * @returns 
 */
function getPeriodParam(req) {
  const from = req.params.from, to = req.params.to;
  if (!isSimpleDate(from)) {
    throw new TypeError(`Invalid ':from' param: "${from}"`);
  }
  if (!isSimpleDate(to)) {
    throw new TypeError(`Invalid ':to' param: "${to}"`);
  }
  return {
    from,
    to
  }
}

function isSimpleDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

module.exports = {
  getIdParam,
  getDateParam,
  getPeriodParam
};
