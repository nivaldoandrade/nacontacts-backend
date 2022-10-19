module.exports = (error, request, response, _next) => {
  console.log(error);
  response.sendStatus(500);
};
