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
				"template_type": "generic",
				"elements": [{
					"title": "Which date are you looking for?",
					"subtitle": "Cambridge Queen's Head Pub?",
					"image_url": "http://www.universityevents.harvard.edu/sites/universityevents.harvard.edu/files/venue_gallderies/queenspub_gallery_2_0.jpg",
					"buttons": [{
              "type": "postback",
              "title": "November 11th—10pm: Claire Dickson is a Boston-based jazz, pop, and R&B vocalist-composer. Supported by Gabe Fox-Peck(keyboard), Sam Firebush (keyboard), Avery Logan (drums) 9pm: fine&YIKES is a minimalist rock cover band that doesn’t pull any punches feat. Eddy Walda Milo Davidson Jess Erion. HUID +1",
           },
           {
             "type": "postback",
             "title": "November 16th—Harvard College Latin Band is a brand new ensemble aimed at performing Latin music and promoting Latinx culture throughout campus, Boston, and beyond! We perform a range of styles from salsa to boleros and want to get everyone dancing!",
          }],
		    }]
	    }
    };
  }

  else if (payload === 'cabcaf') {
    response = {
      "attachment": {
      			"type": "template",
      				"template_type": "generic",
      				"elements": [{
      					"title": "November 1st, 10pm",
      					"subtitle": "Join Cabot Café in a tea tasting with local provider Mem Tea! We'll learn about growth, production, and taste profiles of White, Green, Oolong, Black, and Herbal teas. Brewing, serving, and **tasting** will also be covered!",
      					"image_url": "https://www.facebook.com/cabotcafe/photos/a.748314161861762.1073741825.278980268795156/1996188620407637/?type=3&theater",
      		  }]
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
            "title": "This is what's going on in Pfoho!",
            "subtitle": "Events for both Friday and Saturday",
            "image_url": "https://c1.staticflickr.com/9/8350/8195210264_4b6b10e6bc_b.jpg"
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
