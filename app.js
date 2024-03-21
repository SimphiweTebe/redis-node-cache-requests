const express = require('express')
const axios = require('axios')
const client = require('./config/redisClient')
const responseTime = require('response-time')

const PORT = process.env.PORT || 4000

const app = express()
app.use(responseTime())

app.get('/rockets', async (req, res, next)=> {
  try {
    const cachedData = await client.get('rockets')

    if(cachedData) res.send(cachedData)

    const { data } = await axios.get('https://api.spacexdata.com/v3/rockets')
    client.set('rockets', JSON.stringify(data))
    res.send(data)
  } catch (error) {
    res.send(error.message)
  }
})

app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`))