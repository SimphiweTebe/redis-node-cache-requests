const express = require('express')
const axios = require('axios')
const client = require('./config/redisClient')
const responseTime = require('response-time')

const PORT = process.env.PORT || 4000
const API_URL = 'https://api.spacexdata.com/v3/rockets'

const app = express()
app.use(responseTime())

const handleRequestState = async (key, url)=> {
  try {
    const cachedData = await client.get(key)

    if(cachedData) {
      console.log(`Using cache data on key - ${key}`)
      return cachedData
    }

    const { data } = await axios.get(url)
    console.log(`Setting cache data for key - ${key}`)
    client.set(key, JSON.stringify(data), "EX", 30)
    return data
  } catch (error) {
    res.send(error.message)
  }
}

app.get('/rockets', async (req, res)=> {
  const data = await handleRequestState('rockets', API_URL)
  res.send(data)
})

app.get('/rockets/:rocket_id', async (req, res)=> {
  const { rocket_id } = req.params
  const data = await handleRequestState(rocket_id, `${API_URL}/${rocket_id}`)
  res.send(data)
})

app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`))