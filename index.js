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
					"buttons":
					[{
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
          },
          {
            "type": "postback",
            "title": "Adams House!",
            "payload": "adams",
          },
          {
            "type": "postback",
            "title": "Kirkland House!",
            "payload": "kirkland",
          },
          {
            "type": "postback",
            "title": "Mather House!",
            "payload": "mather",
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
  let reply = [];
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'qh') {
      let json_qh = require('./queenshead.json');
      for (let index_qh = 0; index_qh < 4; index_qh++)
      {
          reply.push(json_qh.data[index_qh].name + ' | ' + json_qh.data[index_qh].start_time + ' to ' + json_qh.data[index_qh].end_time);
      }
      response = {"text": "reply[0] + '\n' + reply[1] + '\n' + reply[2] + '\n' + reply[3] + '\n'"
      };
  }

  else if (payload === 'cabcaf') {
      let json_cc = require('./cabcaf.jsaon');
      for (let index_cc = 0; index_cc < 4; index_cc++)
      {
          reply.push(json_cc.data[index_cc].name + ' | ' + json_cc.data[index_cc].start_time + ' to ' + json_cc.data[index_cc].end_time);
      }
      response = { "text": "reply[0] + '\n' + reply[1] + '\n' + reply[2] + '\n' + reply[3] + '\n'"
      };
  }

  else if (payload === 'pfoho') {
    response = {"text": "Pfoho response!"};
  }

  else if (payload === 'adams') {
    response = {"text": "Adams response!"};
  }

  else if (payload === 'kirkland') {
    response = {"text": "Kirkland response!"};
  }

  else if (payload == 'mather') {
    response = {"text": "Mather response!"};
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
