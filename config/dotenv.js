module.exports = function (/*env*/) {
  return {
    clientAllowedKeys: ['CHAT_SOCKET_URL', 'GOOGLE_API_KEY', 'YOUTUBE_CHANNEL_ID'],
    // Fail build when there is missing any of clientAllowedKeys environment variables.
    //     // By default false.
    failOnMissingKey: false,
  };
};
