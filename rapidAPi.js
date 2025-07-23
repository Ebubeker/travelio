// const request = require('request');

// API_KEYS = [
//   "07c3833658msh099ab4578a2398fp1d594djsnb0887fb5e494", "7296182851msh86204c2984311bbp167e97jsn38efcad68731", "6643c60e66msh2775d7184d93dadp1dc209jsn80da125eacc7"
// ]

// const options = {
//   method: 'POST',
//   url: 'https://travelio1.p.rapidapi.com/user-details',
//   headers: {
//     'x-rapidapi-key': '07c3833658msh099ab4578a2398fp1d594djsnb0887fb5e494',
//     'x-rapidapi-host': 'travelio1.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   body: {
//     destination_city: 'vienna',
//     destination_country: 'at',
//     budget: 1500,
//     dates_start: '2025-08-10',
//     dates_end: '2025-08-16',
//     current_city: 'tirana',
//     current_country: 'al',
//     travel_style: 'adventure',
//     travel_interests: 'museums,food'
//   },
//   json: true
// };

// const options2 = {
//   method: 'POST',
//   url: 'https://travelio1.p.rapidapi.com/flights',
//   headers: {
//     'x-rapidapi-key': '07c3833658msh099ab4578a2398fp1d594djsnb0887fb5e494',
//     'x-rapidapi-host': 'travelio1.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   body: { "destination_city": "vienna", "destination_country": "at", "budget": 1500, "dates_start": "2025-08-10", "dates_end": "2025-08-16", "current_city": "tirana", "current_country": "al" },
//   json: true
// };

// const options3 = {
//   method: 'POST',
//   url: 'https://travelio1.p.rapidapi.com/stays',
//   headers: {
//     'x-rapidapi-key': '07c3833658msh099ab4578a2398fp1d594djsnb0887fb5e494',
//     'x-rapidapi-host': 'travelio1.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   body: {"destination_city":"vienna","destination_country":"at","budget":1500,"dates_start":"2025-08-10","dates_end":"2025-08-16"},
//   json: true
// };

// const optionsList = [options, options2, options3];

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
//   console.log(response);
// });

const request = require('request');

const API_KEYS = [
  "07c3833658msh099ab4578a2398fp1d594djsnb0887fb5e494",
  "7296182851msh86204c2984311bbp167e97jsn38efcad68731",
  "6643c60e66msh2775d7184d93dadp1dc209jsn80da125eacc7"
];

const options = {
  method: 'POST',
  url: 'https://travelio1.p.rapidapi.com/user-details',
  headers: {
    'x-rapidapi-key': '',
    'x-rapidapi-host': 'travelio1.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  body: {
    destination_city: 'vienna',
    destination_country: 'at',
    budget: 1500,
    dates_start: '2025-08-10',
    dates_end: '2025-08-16',
    current_city: 'tirana',
    current_country: 'al',
    travel_style: 'adventure',
    travel_interests: 'museums,food'
  },
  json: true
};

const options2 = {
  method: 'POST',
  url: 'https://travelio1.p.rapidapi.com/flights',
  headers: {
    'x-rapidapi-key': '',
    'x-rapidapi-host': 'travelio1.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  body: {
    "destination_city": "vienna",
    "destination_country": "at",
    "budget": 1500,
    "dates_start": "2025-08-10",
    "dates_end": "2025-08-16",
    "current_city": "tirana",
    "current_country": "al"
  },
  json: true
};

const options3 = {
  method: 'POST',
  url: 'https://travelio1.p.rapidapi.com/stays',
  headers: {
    'x-rapidapi-key': '',
    'x-rapidapi-host': 'travelio1.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  body: {
    "destination_city": "vienna",
    "destination_country": "at",
    "budget": 1500,
    "dates_start": "2025-08-10",
    "dates_end": "2025-08-16"
  },
  json: true
};

const optionsList = [options, options2, options3];

function getRandomApiKey() {
  return API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
}

function getRandomOptions() {
  return optionsList[Math.floor(Math.random() * optionsList.length)];
}

function getRandomWaitTime() {
  return Math.floor(Math.random() * (75000 - 30000 + 1)) + 30000;
}

function makeRequest() {
  const selectedOptions = JSON.parse(JSON.stringify(getRandomOptions())); // Deep copy
  const randomApiKey = getRandomApiKey();
  
  selectedOptions.headers['x-rapidapi-key'] = randomApiKey;
  
  console.log(`Making request to: ${selectedOptions.url}`);
  console.log(`Using API key: ${randomApiKey.substring(0, 8)}...`);
  
  request(selectedOptions, function (error, response, body) {
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Response body:', body);
    console.log('Status code:', response.statusCode);
    console.log('-------------------');
  });
}

function scheduleNextRequest() {
  const waitTime = getRandomWaitTime();
  console.log(`Next request in ${waitTime / 1000} seconds...`);
  
  setTimeout(() => {
    makeRequest();
    scheduleNextRequest(); 
  }, waitTime);
}

console.log('Starting random API requests...');
makeRequest(); 
scheduleNextRequest(); 