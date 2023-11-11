// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors (handler) {
  return async function (req, res, next) {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  makeHandlerAwareOfAsyncErrors
}
