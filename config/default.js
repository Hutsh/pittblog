module.exports = {
  port: 3000,
  session: {
    secret: 'pittblog',
    key: 'pittblog',
    maxAge: 2592000000 //30 days
  },
  mongodb: 'mongodb://localhost:27017/pittblog'
}
