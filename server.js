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

// Set template engine to ejs. This is done so that the server can server ejs files to be rendered by the client
app.set('view engine', 'ejs')

// For making requests to third party APIs
import fetch from 'node-fetch';

const PORT = 8000

// Currently using Trackhive -- this is the token to user their API
const token = process.env.BEARER_TOKEN
const apiKey = process.env.TRACKING_API_KEY

// App begins here

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/tracker', (req, res) => {
  // Create new tracking
  const trackingNumber = req.body.name
  const carrier = req.body.carrier
  console.log(trackingNumber)
  
  fetch(`https://api.trackingmore.com/v3/trackings/create`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Tracking-Api-Key': apiKey
    },
    body: JSON.stringify([
      {
        "tracking_number": trackingNumber,
        "courier_code": carrier,
      }
    ])
  })
  .then(async response => {
    const data = await response.json()
    console.log(data)
  })
  .then(async () => {
    // Get tracking list
    const listResponse = await fetch(`https://api.trackingmore.com/v3/trackings/get?tracking_numbers=${trackingNumber}`, {
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': apiKey
      }
    });

    const listData = await listResponse.json()
    const parcelArr = listData.data

    console.log(parcelArr)

    res.render('index.ejs', {parcelArr});
  })
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})