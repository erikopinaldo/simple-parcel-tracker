import dotenv  from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import multer from "multer"
const upload = multer()

// for parsing application/json
app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

// module.exports = app;

import fetch from 'node-fetch';

const PORT = 8000
const token = process.env.BEARER_TOKEN

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('WORKING')
})

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

// Get tracking list
const listResponse = await fetch('https://api.trackinghive.com/trackings?pageId=undefined&limit=undefined&searchQuery=""', {
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
  }
});

const listData = await listResponse.json()

console.log(listData)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})