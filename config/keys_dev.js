module.exports = {
  mongoURI:
    'mongodb://notsosoftware:acl1234@cluster0-shard-00-00.4adk1.mongodb.net:27017,cluster0-shard-00-01.4adk1.mongodb.net:27017,cluster0-shard-00-02.4adk1.mongodb.net:27017/backendACL?ssl=true&replicaSet=atlas-bc3eki-shard-0&authSource=admin&retryWrites=true&w=majority',
  salt: parseInt(10),
  signingKey: 'acl-project',
}
