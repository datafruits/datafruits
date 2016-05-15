/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: deployTarget
    },
    's3-index': {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
      bucket: "datafruits.fm",
      region: "us-east-1",
      allowOverwrite: true
    },
    's3': {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
      bucket: "datafruits.fm",
      region: "us-east-1"
    }
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    ENV['s3-index'].bucket = 'datafruitstest';
    ENV['s3'].bucket = 'datafruitstest';

    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
