/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 * Starter Project for Messenger Platform Quick Start Tutorial
 *
 * Use this project as the starting point for following the Messenger Platform quick start tutorial.
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
**/

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

'use strict';

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});


// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      }
      else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  }
  else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});


// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {

  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "VERIFICATION_TOKEN";

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {

    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    }
    else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


function handleMessage(sender_psid, received_message) {
	let response;

	// Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which will be added to the body of our request to the Send API
    response = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "What are you looking for?",
					"subtitle": "Choose the venue to see what events are going on?",
					"image_url": "http://www.universityevents.harvard.edu/sites/universityevents.harvard.edu/files/venue_gallderies/queenspub_gallery_2_0.jpg",
					"buttons": [{
              "type": "postback",
              "title": "Cabot Cafe!",
              "payload": "cabcaf",
           },
           {
             "type": "postback",
             "title": "Queen's Head!",
             "payload": "qh",
           },
           {
            "type": "postback",
            "title": "Pforzheimer House (Igloo)!",
            "payload": "pfoho",
          }],
		    }]
			}
		}
    };
  }

	else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'qh') {
    response = {
       "attachment": {
      			"type": "template",
      			"payload": {
      				"template_type": "generic",
      				"elements": [{
      					"title": "November 11th, 8pm",
      					"subtitle": "Join Cabot Café in a tea tasting with local provider Mem Tea! We'll learn about growth, production, and taste profiles of White, Green, Oolong, Black, and Herbal teas. Brewing, serving, and **tasting** will also be covered!",
      						"image_url": "http://www.universityevents.harvard.edu/sites/universityevents.harvard.edu/files/venue_gallderies/queenspub_gallery_2_0.jpg",
					}]
        }
      }
    };
  }

  else if (payload === 'cabcaf') {
    response = {
      "attachment": {
      			"type": "template",
      			"payload": {
      				"template_type": "generic",
      				"elements": [{
      					"title": "November 1st, 10pm",
      					"subtitle": "Join Cabot Café in a tea tasting with local provider Mem Tea! We'll learn about growth, production, and taste profiles of White, Green, Oolong, Black, and Herbal teas. Brewing, serving, and **tasting** will also be covered!",
      					"image_url": "https://www.facebook.com/cabotcafe/photos/a.748314161861762.1073741825.278980268795156/1996188620407637",
      		  }]
        }
      }
    };
  }

  else if (payload === 'pfoho') {
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "December 8th, 7pm",
            "subtitle": "(tentative) Private Event @Igloo",
            "image_url": "https://c1.staticflickr.com/9/8350/8195210264_4b6b10e6bc_b.jpg",
            }]
          }
      }
    };
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}


function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient":
    {
      "id": sender_psid
    },
    "message": response
  };

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('Message sent!');
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

// CITATIONS
/**
 * Citations:
 * The main tutorial we used. Helped us set up Node and Heroku in the Terminal and creating compatibility among different platforms (Facebook, Heroku) via Git and the access tokens, setting up webhooks. https://www.sitepoint.com/building-facebook-chat-bot-node-heroku
 * Messenger's own API (from which the skeleton of index.js is built from): https://github.com/fbsamples/messenger-platform-samples
 * Another Git repository that we used before Messenger's API: https://github.com/jw84/messenger-bot-tutorial
 * Very useful for setting up the chatbot itself: buttons, replies, postbacks and payloads:  https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start
 * Brian Yu's INCREDIBLY helpful guide to setting up Heroku: https://manual.cs50.net/heroku/2017/fall/psets/7/finance
 * A Facebook bot tutorial that explained the basics of setting up the Facebook side of the bot: page, developer tools account, page token: https://medium.com/mindlayer/for-beginners-a-facebook-bot-tutorial-3bb2063091c7
 * Facebook's templates for buttons: https://developers.facebook.com/docs/messenger-platform/send-messages/buttons
 * Helped with downloading and using the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli#npm
 * Developer site that shows tokens: https://developers.facebook.com/apps/168466033890717/messenger/
 * Developer platform tester which handles HTTP requests (this one is for Cabot Cafe in particular), assumes you have a Facebook account to log into: https://developers.facebook.com/tools/explorer/?method=GET&path=278980268795156%2Fevents%3Faccess_token%3D168466033890717EAACZAOA4bVZA0BAA25RtwQ5Rd2LhaKMYfGvYlvIKZCWF1ZAxXBgAn5mW51m7dAvAiq9CgZAhPHFf7ujCV3eTYg8OujMZCHYZAIKp5THaHZAdgk36d0WnGVwbJFJaF2TPKZACRCBq3Wx1JzoI6XZBB4PtSo7ZC6WEN1mrpwYSxypCf9RznOzaWMcMO1a&version=v2.11
**/