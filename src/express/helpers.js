// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
function getIdParam(req) {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

function getDateParam(req) {
  const date = req.params.date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  throw new TypeError(`Invalid ':date' param: "${date}"`);
}

module.exports = { getIdParam, getDateParam };
