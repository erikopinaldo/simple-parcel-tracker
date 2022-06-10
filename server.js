require('dotenv').config()

const express = require('express')
const app = express()
const PORT = 8000
var request = require('request');

const token = process.env.BEARER_TOKEN

// Retrieve courier list
// request('https://api.trackinghive.com/couriers/list', function (error, response, body) {
//   console.log('Status:', response.statusCode);
//   console.log('Headers:', JSON.stringify(response.headers));
//   console.log('Response:', body);
// });

// Create tracking
request({
    method: 'POST',
    url: 'https://api.trackinghive.com/trackings',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: "{  \"tracking_number\": \"9361289676090919095392\",  \"slug\": \"usps\"}"
  }, function (error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers));
    console.log('Response:', body);
  });

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})