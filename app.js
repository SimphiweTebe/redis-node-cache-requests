const express = require('express')
const axios = require('axios')
const client = require('./config/redisClient')
const responseTime = require('response-time')

const PORT = process.env.PORT || 4000
const API_URL = 'https://api.spacexdata.com/v3/rockets'

const app = express()
app.use(responseTime())

app.get('/rockets', async (req, res)=> {
  try {
    const cachedData = await client.get('rockets')

    if(cachedData) {
      res.send(cachedData)
      return
    }

    const { data } = await axios.get(API_URL)
    client.set('rockets', JSON.stringify(data))
    res.send(data)
  } catch (error) {
    res.send(error.message)
  }
})

app.get('/rockets/:rocket_id', async (req, res)=> {
  const { rocket_id } = req.params

  try {
    const cachedData = await client.get(rocket_id)

    if(cachedData) {
      res.send(cachedData)
      return
    }

    const { data } = await axios.get(`${API_URL}/${rocket_id}`)
    client.set(rocket_id, JSON.stringify(data))
    res.send(data)
  } catch (error) {
    console.log(error.message)
  }
})

app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`))