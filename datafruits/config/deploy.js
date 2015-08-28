module.exports = {
  staging: {
    store: {
      type: "S3",
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
      bucket: "datafruitstest-index"
    },

    assets: {
      type: "s3",
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
      bucket: "datafruitstest"
    }
  }
}
