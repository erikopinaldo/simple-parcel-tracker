import dotenv  from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import fetch from 'node-fetch';

const PORT = 8000
const token = process.env.BEARER_TOKEN

// Create tracking
const response = await fetch('https://api.trackinghive.com/trackings', {
    method: 'post',
    body: "{  \"tracking_number\": \"9361289676090919095391\",  \"slug\": \"usps\"}",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });

const data = await response.json()

console.log(data)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})