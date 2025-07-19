// const randomUA = require('random-useragent')
// const puppeteer = require('puppeteer')
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const axios = require('axios')
// const { randomInt } = require('crypto')

// const { chromium } = require('playwright')


// // puppeteer.use(StealthPlugin())

// async function scrapeWithUAOnly(targetUrl, city, country) {
//   // const browser = await puppeteer.launch({
//   //   headless: true,
//   //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   // })
//   const browser = await chromium.launch({ headless: true })
//   const page = await browser.newPage()
//   await page.setUserAgent(randomUA.getRandom())
//   await page.goto(targetUrl, { waitUntil: 'networkidle2' })
//   const cookies = await page.cookies()
//   await browser.close()

//   const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')

//   const delay = ms => new Promise(res => setTimeout(res, ms))

//   const url = 'https://www.booking.com/dml/graphql?lang=en-us'

//   const payload = {
//     operationName: 'AutoComplete',
//     variables: {
//       input: {
//         prefixQuery: `${city}, ${country}`,
//         nbSuggestions: 20,
//         fallbackConfig: {
//           mergeResults: true,
//           nbMaxMergedResults: 6,
//           nbMaxThirdPartyResults: 3,
//           sources: ['GOOGLE', 'HERE']
//         },
//         requestContext: { pageviewId: '2bf16a94f75e00ff' }
//       }
//     },
//     extensions: {},
//     query: `query AutoComplete($input: AutoCompleteRequestInput!) {
//                 autoCompleteSuggestions(input: $input) {
//                   results {
//                     destination {
//                       countryCode
//                       destId
//                       destType
//                       latitude
//                       longitude
//                       __typename
//                     }
//                     displayInfo {
//                       imageUrl
//                       label
//                       labelComponents {
//                         name
//                         type
//                         __typename
//                       }
//                       showEntireHomesCheckbox
//                       title
//                       subTitle
//                       __typename
//                     }
//                     metaData {
//                       isSkiItem
//                       langCode
//                       maxLosData {
//                         extendedLoS
//                         __typename
//                       }
//                       metaMatches {
//                         id
//                         text
//                         type
//                         __typename
//                       }
//                       roundTrip
//                       webFilters
//                       autocompleteResultId
//                       autocompleteResultSource
//                       __typename
//                     }
//                     __typename
//                   }
//                   __typename
//                 }
//       }`
//   }

//   try {
//     const headers = {
//       'Content-Type': 'application/json',
//       'Accept': '*/*',
//       'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
//       'Accept-Encoding': 'gzip, deflate, br',
//       'Referer': 'https://www.booking.com/',
//       'Origin': 'https://travelio-nju8.onrender.com',
//       'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
//       'Sec-Ch-Ua-Mobile': '?0',
//       'Sec-Ch-Ua-Platform': '"Windows"',
//       'Sec-Fetch-Dest': 'empty',
//       'Sec-Fetch-Mode': 'cors',
//       'Sec-Fetch-Site': 'same-origin',
//       'Cache-Control': 'no-cache',
//       'Pragma': 'no-cache',
//       'User-Agent': randomUA.getRandom(),
//     }

//     const response = await axios.post(url, payload, { headers, timeout: 30000 })
//     console.log(`✅ ${url} -> ${response.status}`)
//     return response.data.data.autoCompleteSuggestions.results.find((result => result.destination.destType === 'CITY'))
//   }
//   catch (err) {
//     console.error(`❌ ${url} ->`, err.response?.status || err.message)
//   }

//   await delay(2000 + randomInt(0, 3000))
// }

// module.exports = {
//   scrapeWithUAOnly
// }

// scrapeWithUAOnly('https://www.booking.com/index.html?lang=en-us', 'vienna', 'austria')


const randomUA = require('random-useragent');
const { chromium } = require('playwright');
const axios = require('axios');
const { randomInt } = require('crypto');

/**
 * Scrapes Booking.com autocomplete suggestions for a given city and country using Playwright.
 * @param {string} entryUrl - The Booking.com entry URL (with lang parameter).
 * @param {string} city - The city to query.
 * @param {string} country - The country to query.
 * @returns {Promise<Object|undefined>} - The first result object of type CITY or undefined on error.
 */
async function scrapeWithUAOnly(entryUrl, city, country) {
  // 1. Launch Playwright browser
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath(), });

  // 2. Create a new context with a random User-Agent
  const userAgent = randomUA.getRandom();
  const context = await browser.newContext({
    userAgent,
  });

  // 3. Open a new page in the context
  const page = await context.newPage();

  // 4. Navigate to the entry URL to solve AWS WAF challenge
  try {
    await page.goto(entryUrl, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (err) {
    console.warn(`Initial navigation failed (${err.message}), retrying with index URL`);
    // fallback to explicit index URL if redirect loop occurs
    await page.goto('https://www.booking.com/index.html?lang=en-us', { waitUntil: 'networkidle', timeout: 60000 });
  }

  // 5. Extract cookies after challenge
  const cookies = await context.cookies();

  // 6. Close browser
  await browser.close();

  // 7. Serialize cookies for Axios
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

  // 8. Prepare GraphQL endpoint and payload
  const gqlUrl = 'https://www.booking.com/dml/graphql?lang=en-us';
  const payload = {
    operationName: 'AutoComplete',
    variables: {
      input: {
        prefixQuery: `${city}, ${country}`,
        nbSuggestions: 20,
        fallbackConfig: {
          mergeResults: true,
          nbMaxMergedResults: 6,
          nbMaxThirdPartyResults: 3,
          sources: ['GOOGLE', 'HERE'],
        },
        requestContext: { pageviewId: '2bf16a94f75e00ff' },
      },
    },
    extensions: {},
    query: `query AutoComplete($input: AutoCompleteRequestInput!) {
                      autoCompleteSuggestions(input: $input) {
                        results {
                          destination {
                            countryCode
                            destId
                            destType
                            latitude
                            longitude
                            __typename
                          }
                          displayInfo {
                            imageUrl
                            label
                            labelComponents {
                              name
                              type
                              __typename
                            }
                            showEntireHomesCheckbox
                            title
                            subTitle
                            __typename
                          }
                          metaData {
                            isSkiItem
                            langCode
                            maxLosData {
                              extendedLoS
                              __typename
                            }
                            metaMatches {
                              id
                              text
                              type
                              __typename
                            }
                            roundTrip
                            webFilters
                            autocompleteResultId
                            autocompleteResultSource
                            __typename
                          }
                          __typename
                        }
                        __typename
                      }
            }`,
  };

  // 9. Send POST request with rotated UA and cookies
  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://www.booking.com/',
    'Origin': 'https://travelio-nju8.onrender.com',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'User-Agent': randomUA.getRandom(),
  }

  try {
    const response = await axios.post(gqlUrl, payload, { headers, timeout: 30000 });
    console.log(`✅ ${gqlUrl} -> ${response.status}`);
    const results = response.data?.data?.autoCompleteSuggestions?.results || [];
    return results.find(r => r.destination.destType === 'CITY');
  } catch (err) {
    console.error(`❌ ${gqlUrl} ->`, err.response?.status || err.message);
    return undefined;
  }
}

// Example usage
(async () => {
  const entryUrl = 'https://www.booking.com/index.html?lang=en-us';
  const result = await scrapeWithUAOnly(entryUrl, 'vienna', 'austria');
  console.log('First CITY result:', result);
})();

module.exports = { scrapeWithUAOnly };
