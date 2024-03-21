const redis = require('redis')

const REDIS_PORT = process.env.REDIS_PORT || 6379

const client = redis.createClient({
  host: '127.0.0.1',
  port: REDIS_PORT
})

client.connect()
.then(()=> console.log(`Redis connected on ${REDIS_PORT}`))
.catch((err)=> console.warn(`Redis connection error: ${err.message}`))

module.exports = client