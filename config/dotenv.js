module.exports = function(env) {
  return {
    clientAllowedKeys: ['CHAT_SOCKET_URL'],
    // Fail build when there is missing any of clientAllowedKeys environment variables.
    //     // By default false.
    failOnMissingKey: false
  };
};
