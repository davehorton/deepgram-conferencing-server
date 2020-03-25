
module.exports = function(logger) {
  function getMS(req, res, next) {
    req.locals = req.locals || {};
    const mediaservers = req.srf.locals.lb.getLeastLoaded() ;
    if (!mediaservers || 0 === mediaservers.length) {
      logger.info(`${req.get('Call-ID')}: No available media servers, rejecting call`);
      return res.send(480);
    }
    req.locals.ms = mediaservers[0];
    next();
  }

  return {
    getMS
  };
};
