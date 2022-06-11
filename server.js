// Config setup
import dotenv  from "dotenv"
dotenv.config()

// Import express module and functions
import express from "express"
const app = express()

// For setting up dirname and serving css/js files to client
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// For parsing multipart/form-data
import multer from "multer"
const upload = multer() 
app.use(upload.array()); 
app.use(express.static('public'));

// For making requests to third party APIs
import fetch from 'node-fetch';

const PORT = 8000

// Currently using Trackhive -- this is the token to user their API
const token = process.env.BEARER_TOKEN

// App begins here

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
  const trackingNumber = req.body.name
  console.log(trackingNumber)
  
  fetch('https://api.trackinghive.com/trackings', {
    method: 'post',
    body: `{  \"tracking_number\": \"${trackingNumber}\",  \"slug\": \"usps\"}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
  .then(async response => {
    const data = await response.json()

    console.log(data)

    res.send(data)
  }) 
})

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