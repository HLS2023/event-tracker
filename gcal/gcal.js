let fs = require('fs');
let readline = require('readline');
let google = require('googleapis');
let googleAuth = require('google-auth-library');
let housecalendarids = ['0spevsj3f418i587nsipqdoppk@group.calendar.google.com', // Pfoho Igloo
                        'kirkland.website@gmail.com', // Kirkland House
                        'mather.calendar@gmail.com', // Mather House
                        'adamshousetutors@gmail.com']; // Adams House
let allevents = [];
let allstarts = [];
let allends = [];
let allsummaries = [];

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
let SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
let TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
let TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  let clientSecret = credentials.installed.client_secret;
  let clientId = credentials.installed.client_id;
  let redirectUrl = credentials.installed.redirect_uris[0];
  let auth = new googleAuth();
  let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  let authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token)
{
  try
  {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST')
    {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 4 events on each of the four houses' calendars.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth)
{
  let calendar = google.calendar('v3');
  for (let i = 0; i < housecalendarids.length; i++)
  {
    calendar.events.list(
    {
      auth: auth,
      calendarId: housecalendarids[i],
      timeMin: (new Date()).toISOString(),
      maxResults: 4,
      singleEvents: true,
      orderBy: 'startTime'
    },
    function(err, response)
    {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      let events = response.items;
      if (events.length == 0)
      {
        console.log('No upcoming events in calendar.');
      }
      else
      {
        for (let j = 0; j < events.length; j++) {
          let event = events[j];
          let start = event.start.dateTime || event.start.date;
          let end = event.end.dateTime || event.end.date;
          let summary = event.summary;
          allevents.push(event);
          allstarts.push(start);
          allends.push(end);
          allsummaries.push(summary);
        }
      // Logs all event summaries (within maxResults: 4) from each of the four calendars to the console for error-checking.
      console.log(allsummaries, allstarts, allends);
      }
    });
  }
}

// Plan: stitch this code into index.js and write a function to pass these Google Calendar events into Messenger chatbot payloads.
// Problem: Google Calendar authorization (OAuth) and Facebook Messenger authorization are not working together in one .js file.
// Other problem: the allsummaries array could not be passed between two separate .js files.

/**
 * Citation:
 * Google Calendar API authorization and quickstart, https://developers.google.com/google-apps/calendar/quickstart/nodejs
**/