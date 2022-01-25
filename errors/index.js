exports.handleBadRouteErrors = (req, res, next) => {
  res.status(404).send({
    msg: `Route not found! Use https://nc-gamesapi-world.herokuapp.com/api to see available endpoints.`
  });
};
exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === `22P02`) {
    res.status(400).send({ msg: `bad request!` });
  } else if (err.code === `23503`) {
    res.status(404).send({ msg: `not found` });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  console.log(`500 Error: ${err}`);

  res.status(500).send({ msg: `internal server error` });
};

/* Subscribe to node process errors to catch any unhandled exceptions
thrown outside of express() context. App will be in an invalid state so
also exit with error code 1.
*/

/* Current version of node will terminate process by default on unhandled errors
so log error to screen first before manually terminating. Research process
management tools to help manage and restart terminated processes?
*/
process.on(`uncaughtException`, ex => {
  console.error(ex, `An unhandled exception occurred`);
  process.exit(1);
});
process.on(`unhandledRejection`, ex => {
  console.error(ex, `An unhandled promise rejection occurred`);
  process.exit(1);
});
