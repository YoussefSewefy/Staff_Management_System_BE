module.exports = {
  mongoURI: process.env.MONGO_URI,
  salt: parseInt(process.env.SALT),
  signingKey: process.env.SIGNING_KEY,
}
