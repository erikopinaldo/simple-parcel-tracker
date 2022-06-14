// Config setup
import dotenv  from "dotenv"
dotenv.config()

// Import express module and functions
import express from "express"
const app = express()

// Import MongoDB module and functions
import {MongoClient} from 'mongodb'
const dbConnectionString = process.env.DB_CONNECTION_STRING
const client = new MongoClient(dbConnectionString)

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

// Connect to db
MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('simple-parcel-tracker')
    const trackingNumbersCollection = db.collection('tracking-numbers')

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html')
    })
    
    app.post('/tracker', (req, res) => {
      // Create new tracking
      console.log(req.socket.remoteAddress)
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
        console.log("CREATE RESPONSE: ", data)

        const trackingNumberExists = trackingNumbersCollection.find({trackingNumber: trackingNumber}, {$exists: true}).toArray(function(err, docs) //find if documents that satisfy the criteria exist
        {     
            if(docs.length > 0) //if exists
            {
                console.log(true) // print out what it sends back
                return true
            }
            else // if it does not 
            {
                console.log("Not in docs");
                trackingNumbersCollection.insertOne({trackingNumber, carrier})
                .then(result => {
                  console.log("INSERT ONE RESULT: ", result)
                })
                .catch(error => console.error(error))
            }
        });

        if (!trackingNumberExists) {
          
        }
      
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
  })
  .catch(error => console.error(error))

